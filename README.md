# пгтюн.рф

<p align="center">
  <strong>Тюнинг конфигурации PostgreSQL под ваше железо.</strong>
</p>

---

[Русский](docs/README.ru.md) · [Enterprise](docs/README.enterprise.md) · [Гопник](docs/README.gopnik.md) · [⠃⠗⠁⠊⠇⠇⠑ (Braille)](docs/README.braille.md) · [Бабушка](docs/README.babushka.md)

---

## Быстрый старт

```bash
yarn        # установка зависимостей
yarn dev    # запуск сервера разработки (порт 5173)
yarn test   # запуск тестов
yarn lint   # проверка форматирования
yarn build  # сборка для продакшена
```

## curl API

```bash
# JSON (по умолчанию)
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=web&total_memory=2&total_memory_unit=GB&cpus=2&connections=300&hd_type=ssd"

# Формат postgresql.conf
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=web&total_memory=2&total_memory_unit=GB&cpus=2&connections=300&hd_type=ssd&format=conf"

# Формат ALTER SYSTEM
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=web&total_memory=2&total_memory_unit=GB&cpus=2&connections=300&hd_type=ssd&format=alter"
```

| Параметр | Значения | По умолчанию |
|---|---|---|
| `db_version` | 12, 13, 14, 15, 16, 17, 18 | 18 |
| `os_type` | linux, windows, mac | linux |
| `db_type` | web, oltp, dw, desktop, mixed | web |
| `total_memory` | число | — |
| `total_memory_unit` | GB, MB | GB |
| `cpus` | число | — |
| `connections` | число (мин. 20) | — |
| `hd_type` | ssd, hdd, san | ssd |
| `format` | json, conf, alter | json |

---

## Changelog

### 2026-03-17 — Улучшение логики расчётов

Изменения в `src/features/configuration/configurationSlice.js` и `api/config.js`:

#### 1. shared_buffers — масштабирование для больших серверов

- **Было:** Всегда 25% RAM для всех типов нагрузки (кроме desktop — 6.25%)
- **Стало:** Для серверов с >64 ГБ RAM типы OLTP, DW и Mixed получают 40% RAM
- **Причина:** PostgreSQL wiki рекомендует до 40% для больших серверов, т.к. при большом объёме памяти больший shared_buffers снижает I/O и улучшает hit ratio
- **Примеры:**
  - 2 ГБ RAM, web → 512 МБ (25%, без изменений)
  - 128 ГБ RAM, web → 32 ГБ (25%, без изменений)
  - 128 ГБ RAM, oltp → ~51.2 ГБ (40%, было 32 ГБ)

#### 2. effective_io_concurrency — поддержка Windows на PG 13+

- **Было:** Возвращал `null` для всех ОС кроме Linux
- **Стало:** Возвращает значения для Windows начиная с PostgreSQL 13
- **Причина:** В PostgreSQL 13 добавлена поддержка `effective_io_concurrency` на Windows (коммит [e73531e](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=e73531e))
- **Значения:** HDD=2, SSD=200, SAN=300 (аналогично Linux)
- macOS по-прежнему не поддерживается

#### 3. huge_pages — порог на основе shared_buffers

- **Было:** Включался при общей RAM ≥ 32 ГБ
- **Стало:** Включается при shared_buffers ≥ 8 ГБ
- **Причина:** huge_pages влияют на производительность именно shared memory, а не всей RAM. Пороговое значение 8 ГБ shared_buffers — это точка, где TLB misses начинают заметно влиять на производительность
- **Примеры:**
  - 2 ГБ RAM → shared_buffers=512МБ → `off`
  - 64 ГБ RAM → shared_buffers=16ГБ → `try`
  - 128 ГБ RAM, oltp → shared_buffers=51.2ГБ → `try`

#### 4. work_mem — использование max_parallel_workers_per_gather

- **Было:** Формула: `(RAM - shared_buffers) / ((connections + max_worker_processes) * 3)`
- **Стало:** Формула: `(RAM - shared_buffers) / ((connections + max_parallel_workers_per_gather) * 3)`
- **Причина:** `max_worker_processes` — это общее количество фоновых воркеров (по умолчанию 8), а `max_parallel_workers_per_gather` — реальный параллелизм на один запрос (обычно 2-4). Использование workers_per_gather точнее отражает потребление памяти на запрос

#### 5. Убрано предупреждение для больших серверов

- **Было:** Предупреждение "this tool not being optimal for very high memory systems" при RAM > 100 ГБ
- **Стало:** Предупреждение убрано
- **Причина:** С улучшенным масштабированием shared_buffers инструмент корректно работает с большими объёмами памяти

### Тесты

Добавлены новые тесты (всего 33, было 26):
- `selectSharedBuffers`: стандартный 25%, масштабирование до 40% для больших серверов, web остаётся на 25%
- `selectHugePages`: off при малом shared_buffers, try при ≥8ГБ
- `selectEffectiveIoConcurrency`: Windows PG12 (null), Windows PG13 (200), macOS (null)

## Контрибьют

1. Форкни репозиторий
2. Создай ветку для фичи (`git checkout -b my-new-feature`)
3. Закоммить изменения (`git commit -am 'Add some feature'`)
4. Запушь ветку (`git push origin my-new-feature`)
5. Создай Pull Request

---

## Авторы

Основано на оригинальном [pgtune](https://github.com/gregs1104/pgtune) от Greg Smith.
Веб-версия: [le0pard/pgtune](https://github.com/le0pard/pgtune) от [Oleksii Vasyliev](https://github.com/le0pard).
