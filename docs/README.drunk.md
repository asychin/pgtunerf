# пгтюн.рф

## Русский после трёх тостов

### Чт... что это такое?

**пгтюн.рф** — это... ну... как его... настраивает PostgreSQL... ик... автоматически! Вводишь параметры сервера... и он тебе выдаёт конфиг... красота!

### Что умеет... ик?

- Постгрес от 12 до... до... 18! Все версии... наверное
- Линукс, Винда, Мак... или как там они называются
- Сайты, транзакции... ик... аналитика, десктоп... всё подряд
- ССД, жёсткий диск, сетевой... какой-то
- Копируется... куда-то... в буфер обмена!
- 5 языков! Зачем? А потому что... наливай!
- Тёмная тема... для тёмных ночей... ик
- curl API... для тех, кто ещё может печатать

### Как запустить... ик?

```bash
yarn        # подождать... пока установится... ик
yarn dev    # запустить... на каком-то порту... 5173 вроде
yarn test   # тесты... надо бы запустить... наверное
yarn lint   # проверить... чё там... ик
yarn build  # собрать... для... как это... продакшена!
```

### curl... если руки не дрожат

```bash
# JSON... ик... по умолчанию
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=web&total_memory=2&total_memory_unit=GB&cpus=2&connections=300&hd_type=ssd"

# Конфиг... ик... файлом
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=web&total_memory=2&total_memory_unit=GB&cpus=2&connections=300&hd_type=ssd&format=conf"

# ALTER SYSTEM... если ты ещё помнишь что это
curl "https://domain/api/config?db_version=18&os_type=linux&db_type=web&total_memory=2&total_memory_unit=GB&cpus=2&connections=300&hd_type=ssd&format=alter"
```

### Параметры... ик... запроса

| Парам... параметр | Знач... значения | По умолч... умолчанию |
|---|---|---|
| `db_version` | 12, 13, 14, 15... ик... 16, 17, 18 | 18 |
| `os_type` | linux, windows, mac | linux |
| `db_type` | web, oltp, dw, desktop, mixed | web |
| `total_memory` | число... какое-то | — |
| `total_memory_unit` | GB, MB | GB |
| `cpus` | число | — |
| `connections` | число (мин. 20... или 30... не помню) | — |
| `hd_type` | ssd, hdd, san | ssd |
| `format` | json, conf, alter | json |

> Главное... ик... не перепутать продакшен с девом... один раз уже перепутал... третий тост был лишним... но конфиг получился отличный!

### Контрибьют... ик

1. Форкни репу... если найдёшь кнопку
2. Создай ветку... как-нибудь (`git checkout -b my-new-feature`)
3. Закоммить... что там написал... ик (`git commit -am 'Add some feature'`)
4. Запушь... куда-то... (`git push origin my-new-feature`)
5. Создай Pull Request... наверное

---

[< Назад к основному README](../README.md)
