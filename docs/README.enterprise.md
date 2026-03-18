# пгтюн.рф

## Русский Enterprise

### Описание продукта

**пгтюн.рф** — корпоративное решение для автоматизированной оптимизации конфигурационных параметров СУБД PostgreSQL на основе аппаратных характеристик целевой инфраструктуры.

### Функциональные требования

- Поддерживаемые версии СУБД: PostgreSQL 12–18
- Целевые операционные платформы: Linux (рекомендовано), Windows Server, macOS
- Профили нагрузки: веб-сервис (HTTPS), OLTP (транзакционный), DWH (аналитический), десктопная рабочая станция, гибридная нагрузка
- Подсистемы хранения: SSD (NVMe/SATA), HDD (SATA/SAS), SAN (FC/iSCSI)
- Форматы выгрузки: `postgresql.conf`, `ALTER SYSTEM`
- Интеграция с CI/CD посредством REST API эндпоинта
- 5 (пять) локализаций интерфейса для обеспечения максимального охвата целевой аудитории

### Развёртывание среды разработки

Для инициализации среды разработки необходимо выполнить следующую последовательность операций:

```bash
yarn        # инсталляция зависимостей проекта
yarn dev    # запуск сервера разработки (порт 5173)
yarn test   # выполнение регрессионного тестирования
yarn lint   # статический анализ кодовой базы
yarn build  # сборка production-артефактов
```

### REST API

Программный интерфейс для интеграции с внешними системами:

```bash
# Выгрузка в формате JSON (по умолчанию)
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=oltp&total_memory=64&total_memory_unit=GB&cpus=16&connections=500&hd_type=ssd"

# Выгрузка в формате postgresql.conf
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=oltp&total_memory=64&total_memory_unit=GB&cpus=16&connections=500&hd_type=ssd&format=conf"

# Выгрузка в формате ALTER SYSTEM
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=oltp&total_memory=64&total_memory_unit=GB&cpus=16&connections=500&hd_type=ssd&format=alter"
```

### Параметры запроса

| Параметр | Допустимые значения | Значение по умолчанию |
|---|---|---|
| `db_version` | 12, 13, 14, 15, 16, 17, 18 | 18 |
| `os_type` | linux, windows, mac | linux |
| `db_type` | web, oltp, dw, desktop, mixed | web |
| `total_memory` | целое число | — |
| `total_memory_unit` | GB, MB | GB |
| `cpus` | целое число | — |
| `connections` | целое число (минимум 20) | — |
| `hd_type` | ssd, hdd, san | ssd |
| `format` | json, conf, alter | json |

> **Примечание для руководства:** Данный инструмент прошёл все этапы согласования и полностью соответствует требованиям информационной безопасности. Совместимость с 1С не проверялась.

### Порядок внесения изменений

1. Выполнить fork репозитория
2. Создать feature-ветку (`git checkout -b my-new-feature`)
3. Зафиксировать изменения в системе контроля версий (`git commit -am 'Add some feature'`)
4. Опубликовать ветку в удалённый репозиторий (`git push origin my-new-feature`)
5. Инициировать Pull Request на рассмотрение

---

[< Назад к основному README](../README.md)
