#!/usr/bin/env python3
"""namecheap — a tiny CLI over the Namecheap API, so you never touch their website.

Credentials are read from, in order:
  1. env vars  NAMECHEAP_API_USER, NAMECHEAP_API_KEY, NAMECHEAP_USERNAME
  2. ~/.config/namecheap/credentials.json   {"api_user","api_key","username"}

ClientIp is auto-detected (your current public IP) unless NAMECHEAP_CLIENT_IP is
set. That IP must be on your Namecheap API allowlist
(Profile -> Tools -> Namecheap API Access -> Manage allowed IPs).

Usage:
  nc.py status [DOMAIN]      expiry, auto-renew, lock — one domain or all
  nc.py list                 all domains in the account
  nc.py info DOMAIN          detailed registry/whois info for a domain
  nc.py renew DOMAIN [YEARS] renew (default 1 year; charges account balance)
  nc.py whoami               show which credentials/IP would be used
"""
from __future__ import annotations

import json
import os
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

API_URL = "https://api.namecheap.com/xml.response"
CRED_PATH = os.path.expanduser("~/.config/namecheap/credentials.json")


def load_credentials() -> dict:
    creds = {
        "api_user": os.environ.get("NAMECHEAP_API_USER"),
        "api_key": os.environ.get("NAMECHEAP_API_KEY"),
        "username": os.environ.get("NAMECHEAP_USERNAME"),
    }
    if not all(creds.values()) and os.path.exists(CRED_PATH):
        with open(CRED_PATH) as fh:
            file_creds = json.load(fh)
        for key in creds:
            creds[key] = creds[key] or file_creds.get(key)
    # api_user and username are usually the same account name.
    creds["username"] = creds["username"] or creds["api_user"]
    creds["api_user"] = creds["api_user"] or creds["username"]
    missing = [k for k in ("api_user", "api_key", "username") if not creds.get(k)]
    if missing:
        sys.exit(
            f"Missing credentials: {', '.join(missing)}.\n"
            f"Set env vars or write {CRED_PATH} "
            '({"api_user":..., "api_key":..., "username":...}).'
        )
    return creds


def public_ip() -> str:
    ip = os.environ.get("NAMECHEAP_CLIENT_IP")
    if ip:
        return ip
    with urllib.request.urlopen("https://api.ipify.org", timeout=10) as resp:
        return resp.read().decode().strip()


def local(tag: str) -> str:
    """Strip the XML namespace from a tag."""
    return tag.rsplit("}", 1)[-1]


def call(command: str, **params) -> ET.Element:
    creds = load_credentials()
    query = {
        "ApiUser": creds["api_user"],
        "ApiKey": creds["api_key"],
        "UserName": creds["username"],
        "ClientIp": public_ip(),
        "Command": command,
        **params,
    }
    url = f"{API_URL}?{urllib.parse.urlencode(query)}"
    with urllib.request.urlopen(url, timeout=30) as resp:
        root = ET.fromstring(resp.read())

    if root.attrib.get("Status") != "OK":
        msgs = [e.text or "" for e in root.iter() if local(e.tag) == "Error"]
        hint = ""
        if any("ip" in m.lower() for m in msgs):
            hint = (
                f"\n\nThis usually means your current IP is not allowlisted.\n"
                f"Current public IP: {public_ip()}\n"
                "Add it here (only you can — it's your account):\n"
                "  Profile -> Tools -> Namecheap API Access -> Manage allowed IPs\n"
                "  https://ap.www.namecheap.com/settings/tools/apiaccess/"
            )
        sys.exit("Namecheap API error:\n  " + "\n  ".join(msgs or ["unknown error"]) + hint)
    return root


def find_all(root: ET.Element, name: str):
    return [e for e in root.iter() if local(e.tag) == name]


def cmd_list(_args):
    root = call("namecheap.domains.getList", PageSize="100")
    domains = find_all(root, "Domain")
    _print_domain_table(domains)


def cmd_status(args):
    target = args[0].lower() if args else None
    root = call("namecheap.domains.getList", PageSize="100")
    domains = find_all(root, "Domain")
    if target:
        domains = [d for d in domains if d.attrib.get("Name", "").lower() == target]
        if not domains:
            sys.exit(f"Domain not found in account: {target}")
    _print_domain_table(domains)


def _print_domain_table(domains):
    if not domains:
        print("No domains.")
        return
    rows = []
    for d in domains:
        a = d.attrib
        rows.append(
            (
                a.get("Name", "?"),
                a.get("Expires", "?"),
                "on" if a.get("AutoRenew") == "true" else "OFF",
                "locked" if a.get("IsLocked") == "true" else "unlocked",
                "EXPIRED" if a.get("IsExpired") == "true" else "active",
            )
        )
    widths = [max(len(r[i]) for r in (*rows, ("DOMAIN", "EXPIRES", "AUTO-RENEW", "LOCK", "STATE"))) for i in range(5)]
    header = ("DOMAIN", "EXPIRES", "AUTO-RENEW", "LOCK", "STATE")
    line = "  ".join(h.ljust(widths[i]) for i, h in enumerate(header))
    print(line)
    print("  ".join("-" * widths[i] for i in range(5)))
    for r in rows:
        print("  ".join(r[i].ljust(widths[i]) for i in range(5)))


def cmd_info(args):
    if not args:
        sys.exit("usage: nc.py info DOMAIN")
    root = call("namecheap.domains.getInfo", DomainName=args[0])
    result = find_all(root, "DomainGetInfoResult")
    if result:
        a = result[0].attrib
        print(f"Domain : {a.get('DomainName')}")
        print(f"Status : {a.get('Status')}")
    for created in find_all(root, "CreatedDate"):
        print(f"Created: {created.text}")
    for exp in find_all(root, "ExpiredDate"):
        print(f"Expires: {exp.text}")


def cmd_renew(args):
    if not args:
        sys.exit("usage: nc.py renew DOMAIN [YEARS]")
    domain = args[0]
    years = args[1] if len(args) > 1 else "1"
    root = call("namecheap.domains.renew", DomainName=domain, Years=years)
    res = find_all(root, "DomainRenewResult")
    if res:
        a = res[0].attrib
        print(f"Renewed {a.get('DomainName')} — now charged: {a.get('Charged')}")
        for exp in find_all(root, "ExpireDate") + find_all(root, "DomainDetails"):
            if exp.text:
                print(f"New expiry: {exp.text}")
    else:
        print("Renew command sent; check `nc.py status` to confirm new expiry.")


def cmd_dns(args):
    if not args:
        sys.exit("usage: nc.py dns DOMAIN")
    if "." not in args[0]:
        sys.exit("domain must look like name.tld")
    sld, tld = args[0].split(".", 1)
    root = call("namecheap.domains.dns.getHosts", SLD=sld, TLD=tld)
    hosts = find_all(root, "host")
    if not hosts:
        print("No host records (domain may not use Namecheap BasicDNS).")
        return
    header = ("TYPE", "HOST", "VALUE", "TTL", "MXPREF")
    rows = [
        (
            h.attrib.get("Type", ""),
            h.attrib.get("Name", ""),
            h.attrib.get("Address", ""),
            h.attrib.get("TTL", ""),
            h.attrib.get("MXPref", ""),
        )
        for h in hosts
    ]
    widths = [max(len(r[i]) for r in (*rows, header)) for i in range(5)]
    print("  ".join(header[i].ljust(widths[i]) for i in range(5)))
    print("  ".join("-" * widths[i] for i in range(5)))
    for r in rows:
        print("  ".join(r[i].ljust(widths[i]) for i in range(5)))


def _get_records(domain):
    sld, tld = domain.split(".", 1)
    root = call("namecheap.domains.dns.getHosts", SLD=sld, TLD=tld)
    out = []
    for h in find_all(root, "host"):
        a = h.attrib
        out.append(
            {
                "type": a.get("Type", ""),
                "host": a.get("Name", ""),
                "address": a.get("Address", ""),
                "ttl": a.get("TTL", "1800"),
                "mxpref": a.get("MXPref", "10"),
            }
        )
    return out


def cmd_dnsexport(args):
    """Dump current DNS records as JSON (the format `dnsset` reads back)."""
    if not args:
        sys.exit("usage: nc.py dnsexport DOMAIN")
    print(json.dumps(_get_records(args[0]), indent=2))


def cmd_dnsset(args):
    """Replace the FULL host-record set from a JSON file. Namecheap has no
    per-record API — setHosts overwrites everything — so the JSON must contain
    EVERY record you want to keep. Always `dnsexport` to a backup first."""
    if len(args) < 2:
        sys.exit("usage: nc.py dnsset DOMAIN RECORDS.json")
    sld, tld = args[0].split(".", 1)
    with open(args[1]) as fh:
        records = json.load(fh)
    params = {"SLD": sld, "TLD": tld}
    for i, r in enumerate(records, 1):
        params[f"HostName{i}"] = r["host"]
        params[f"RecordType{i}"] = r["type"]
        params[f"Address{i}"] = r["address"]
        params[f"TTL{i}"] = str(r.get("ttl", "1800"))
        if r["type"].upper() == "MX":
            params[f"MXPref{i}"] = str(r.get("mxpref", "10"))
    root = call("namecheap.domains.dns.setHosts", **params)
    res = find_all(root, "DomainDNSSetHostsResult")
    ok = res[0].attrib.get("IsSuccess") if res else "?"
    print(f"setHosts IsSuccess={ok} — wrote {len(records)} records")


def cmd_whoami(_args):
    creds = load_credentials()
    print(f"api_user : {creds['api_user']}")
    print(f"username : {creds['username']}")
    print(f"api_key  : {'set (' + str(len(creds['api_key'])) + ' chars)' if creds['api_key'] else 'MISSING'}")
    print(f"client_ip: {public_ip()}   (must be on your Namecheap allowlist)")


COMMANDS = {
    "status": cmd_status,
    "list": cmd_list,
    "info": cmd_info,
    "renew": cmd_renew,
    "dns": cmd_dns,
    "dnsexport": cmd_dnsexport,
    "dnsset": cmd_dnsset,
    "whoami": cmd_whoami,
}


def main():
    if len(sys.argv) < 2 or sys.argv[1] in ("-h", "--help", "help"):
        print(__doc__)
        return
    cmd = sys.argv[1]
    if cmd not in COMMANDS:
        sys.exit(f"Unknown command: {cmd}\n\n{__doc__}")
    COMMANDS[cmd](sys.argv[2:])


if __name__ == "__main__":
    main()
