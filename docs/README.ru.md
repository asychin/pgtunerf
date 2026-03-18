# пгтюн.рф

## Русский

### Что это?

**пгтюн.рф** — инструмент для автоматической настройки конфигурации PostgreSQL под ваше железо. Вводите параметры сервера — получаете оптимальный `postgresql.conf` или `ALTER SYSTEM` команды.

### Возможности

- Поддержка PostgreSQL версий 12–18
- Операционные системы: Linux, Windows, macOS
- Профили нагрузки: веб-приложение, OLTP, хранилище данных, десктоп, смешанный
- Типы хранилищ: SSD, HDD, SAN
- Экспорт в `postgresql.conf` или `ALTER SYSTEM`
- Копирование конфигурации в один клик
- 5 вариантов русского языка интерфейса (потому что можем)
- Тёмная тема
- curl API для получения конфигурации из командной строки

### Разработка

```bash
yarn        # установка зависимостей
yarn dev    # запуск сервера разработки (порт 5173)
yarn test   # запуск тестов
yarn lint   # проверка форматирования
yarn build  # сборка для продакшена
```

### curl API

```bash
# JSON (по умолчанию)
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=web&total_memory=2&total_memory_unit=GB&cpus=2&connections=300&hd_type=ssd"

# Формат postgresql.conf
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=web&total_memory=2&total_memory_unit=GB&cpus=2&connections=300&hd_type=ssd&format=conf"

# Формат ALTER SYSTEM
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=web&total_memory=2&total_memory_unit=GB&cpus=2&connections=300&hd_type=ssd&format=alter"
```

### Параметры запроса

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

### Контрибьют

1. Форкни репозиторий
2. Создай ветку для фичи (`git checkout -b my-new-feature`)
3. Закоммить изменения (`git commit -am 'Add some feature'`)
4. Запушь ветку (`git push origin my-new-feature`)
5. Создай Pull Request

---

[< Назад к основному README](../README.md)
