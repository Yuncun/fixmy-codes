# namecheap — project-scoped tool

A small CLI to manage the **fixmy.codes** domain at Namecheap from the terminal
— check expiry, renew, read/write DNS — without the Namecheap website. It lives
in this repo on purpose and is not meant to outlive the project.

## Run it (from the repo root)

```bash
python3 tools/namecheap/nc.py status fixmy.codes
python3 tools/namecheap/nc.py renew fixmy.codes
python3 tools/namecheap/nc.py dns fixmy.codes
```

Commands: `status [domain]`, `list`, `info DOMAIN`, `dns DOMAIN`,
`dnsexport DOMAIN`, `dnsset DOMAIN file.json`, `renew DOMAIN [years]`, `whoami`.

## Credentials

Read from `~/.config/namecheap/credentials.json` (kept out of the repo):

```json
{ "api_user": "Yuncun", "api_key": "...", "username": "Yuncun" }
```

Get or reset the key at Namecheap: Profile → Tools → Namecheap API Access. The
API only answers from allowlisted IPs — if your IP changes, calls fail and the
tool prints your current IP plus the page to add it. `nc.py whoami` shows that IP.
