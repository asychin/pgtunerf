# пгтюн.рф

## Русский гопник

### Чё за тема?

**пгтюн.рф** — чётко настраивает постгрес под твоё железо, без базара. Вбиваешь параметры — получаешь конфиг. Всё просто, пацаны.

### Чё умеет?

- Постгрес 12–18, все версии, чётко
- Линукс, Винда, Мак — без разницы
- Сайтики, транзакции, аналитика, десктоп — всё поддерживает
- ССД, жёсткий, сеть — любой диск
- Конфиг копируется в один клик, красава
- 5 вариантов русского языка, потому что могём
- Тёмная тема для нормальных пацанов
- curl API — для тех, кто в теме

### Как запустить эту тему?

```bash
yarn        # подтянуть зависимости
yarn dev    # запустить на 5173 порту
yarn test   # прогнать тесты
yarn lint   # проверить, чё всё чётко
yarn build  # собрать для продакшена
```

### curl, для тех кто шарит

```bash
# Конфиг файлом
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=web&total_memory=2&total_memory_unit=GB&cpus=2&connections=300&hd_type=ssd&format=conf"

# ALTER SYSTEM, если ты такой продвинутый
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=web&total_memory=2&total_memory_unit=GB&cpus=2&connections=300&hd_type=ssd&format=alter"
```

### Параметры, пацаны

| Параметр | Чё вбивать | По дефолту |
|---|---|---|
| `db_version` | 12, 13, 14, 15, 16, 17, 18 | 18 |
| `os_type` | linux, windows, mac | linux |
| `db_type` | web, oltp, dw, desktop, mixed | web |
| `total_memory` | число | — |
| `total_memory_unit` | GB, MB | GB |
| `cpus` | число | — |
| `connections` | число (мин. 20) | — |
| `hd_type` | ssd, hdd, san | ssd |
| `format` | conf, alter | conf |

> Короче, вбил параметры, получил конфиг, закинул в постгрес, ребутнул — и всё чётко работает. Базара нет.

---

[< Назад к основному README](../README.md)
