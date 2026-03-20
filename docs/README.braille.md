# ⠏⠛⠞⠥⠝⠑.⠗⠋

## ⠃⠗⠁⠊⠇⠇⠑ (Braille)

### ⠉⠞⠕ ⠪⠞⠕?

**⠏⠛⠞⠥⠝.⠗⠋** — ⠊⠝⠎⠞⠗⠥⠍⠑⠝⠞ ⠙⠇⠾ ⠁⠧⠞⠕⠍⠁⠞⠊⠉⠑⠎⠅⠕⠯ ⠝⠁⠎⠞⠗⠕⠯⠅⠊ ⠅⠕⠝⠋⠊⠛⠥⠗⠁⠉⠊⠊ PostgreSQL ⠏⠕⠙ ⠧⠁⠱⠑ ⠕⠃⠕⠗⠥⠙⠕⠧⠁⠝⠊⠑. ⠧⠧⠕⠙⠊⠞⠑ ⠏⠁⠗⠁⠍⠑⠞⠗⠮ ⠎⠑⠗⠧⠑⠗⠁ — ⠏⠕⠇⠥⠉⠁⠑⠞⠑ ⠕⠏⠞⠊⠍⠁⠇⠽⠝⠮⠯ postgresql.conf ⠊⠇⠊ ALTER SYSTEM ⠅⠕⠍⠁⠝⠙⠮.

### ⠧⠕⠵⠍⠕⠚⠝⠕⠎⠞⠊

- ⠏⠕⠙⠙⠑⠗⠚⠅⠁ PostgreSQL ⠧⠑⠗⠎⠊⠯ 12–18
- ⠕⠏⠑⠗⠁⠉⠊⠕⠝⠝⠮⠑ ⠎⠊⠎⠞⠑⠍⠮: Linux, Windows, macOS
- ⠏⠗⠕⠋⠊⠇⠊ ⠝⠁⠛⠗⠥⠵⠅⠊: ⠧⠑⠃-⠏⠗⠊⠇⠕⠚⠑⠝⠊⠑, OLTP, ⠓⠗⠁⠝⠊⠇⠊⠺⠑ ⠙⠁⠝⠝⠮⠓, ⠙⠑⠎⠅⠞⠕⠏, ⠎⠍⠑⠱⠁⠝⠝⠮⠯
- ⠞⠊⠏⠮ ⠓⠗⠁⠝⠊⠇⠊⠺: SSD, HDD, SAN
- ⠪⠅⠎⠏⠕⠗⠞ ⠧ postgresql.conf ⠊⠇⠊ ALTER SYSTEM
- ⠅⠕⠏⠊⠗⠕⠧⠁⠝⠊⠑ ⠅⠕⠝⠋⠊⠛⠥⠗⠁⠉⠊⠊ ⠧ ⠕⠙⠊⠝ ⠅⠇⠊⠅
- ⠞⠑⠍⠝⠁⠾ ⠞⠑⠍⠁
- curl API ⠙⠇⠾ ⠏⠕⠇⠥⠉⠑⠝⠊⠾ ⠅⠕⠝⠋⠊⠛⠥⠗⠁⠉⠊⠊ ⠊⠵ ⠅⠕⠍⠁⠝⠙⠝⠕⠯ ⠎⠞⠗⠕⠅⠊

### ⠗⠁⠵⠗⠁⠃⠕⠞⠅⠁

```bash
yarn        # ⠥⠎⠞⠁⠝⠕⠧⠅⠁ ⠵⠁⠧⠊⠎⠊⠍⠕⠎⠞⠑⠯
yarn dev    # ⠵⠁⠏⠥⠎⠅ ⠎⠑⠗⠧⠑⠗⠁ ⠗⠁⠵⠗⠁⠃⠕⠞⠅⠊ (⠏⠕⠗⠞ 5173)
yarn test   # ⠵⠁⠏⠥⠎⠅ ⠞⠑⠎⠞⠕⠧
yarn lint   # ⠏⠗⠕⠧⠑⠗⠅⠁ ⠋⠕⠗⠍⠁⠞⠊⠗⠕⠧⠁⠝⠊⠾
yarn build  # ⠎⠃⠕⠗⠅⠁ ⠙⠇⠾ ⠏⠗⠕⠙⠁⠅⠱⠑⠝⠁
```

### curl API

```bash
# JSON (⠏⠕ ⠥⠍⠕⠇⠉⠁⠝⠊⠳)
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=web&total_memory=2&total_memory_unit=GB&cpus=2&connections=300&hd_type=ssd"

# ⠋⠕⠗⠍⠁⠞ postgresql.conf
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=web&total_memory=2&total_memory_unit=GB&cpus=2&connections=300&hd_type=ssd&format=conf"

# ⠋⠕⠗⠍⠁⠞ ALTER SYSTEM
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=web&total_memory=2&total_memory_unit=GB&cpus=2&connections=300&hd_type=ssd&format=alter"
```

### ⠏⠁⠗⠁⠍⠑⠞⠗⠮ ⠵⠁⠏⠗⠕⠎⠁

| ⠏⠁⠗⠁⠍⠑⠞⠗ | ⠵⠝⠁⠉⠑⠝⠊⠾ | ⠏⠕ ⠥⠍⠕⠇⠉⠁⠝⠊⠳ |
|---|---|---|
| `db_version` | 12, 13, 14, 15, 16, 17, 18 | 18 |
| `os_type` | linux, windows, mac | linux |
| `db_type` | web, oltp, dw, desktop, mixed | web |
| `total_memory` | ⠉⠊⠎⠇⠕ | — |
| `total_memory_unit` | GB, MB | GB |
| `cpus` | ⠉⠊⠎⠇⠕ | — |
| `connections` | ⠉⠊⠎⠇⠕ (⠍⠊⠝. 20) | — |
| `hd_type` | ssd, hdd, san | ssd |
| `format` | json, conf, alter | json |

### ⠅⠕⠝⠞⠗⠊⠃⠽⠞

1. ⠋⠕⠗⠅⠝⠊ ⠗⠑⠏⠕⠵⠊⠞⠕⠗⠊⠯
2. ⠎⠕⠵⠙⠁⠯ ⠧⠑⠞⠅⠥ ⠙⠇⠾ ⠋⠊⠉⠊ (`git checkout -b my-new-feature`)
3. ⠵⠁⠅⠕⠍⠍⠊⠞⠽ ⠊⠵⠍⠑⠝⠑⠝⠊⠾ (`git commit -am 'Add some feature'`)
4. ⠵⠁⠏⠥⠱⠽ ⠧⠑⠞⠅⠥ (`git push origin my-new-feature`)
5. ⠎⠕⠵⠙⠁⠯ Pull Request

---

[< ⠝⠁⠵⠁⠙ ⠅ ⠕⠎⠝⠕⠧⠝⠕⠍⠥ README](../README.md)
