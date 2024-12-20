# React Table Components

Мощный и настраиваемый компонент таблицы, созданный на React, с поддержкой фильтрации, пагинации, вкладок и множественного выбора для эффективного управления данными.

## Содержание
- [Функции](#функции)
- [Установка](#установка)
- [Примеры](#примеры)

---

## Функции

### 🎛️ Фильтрация
- **Фильтрация по столбцам**: Легко фильтруйте данные по отдельным столбцам для быстрого поиска нужной информации.
- **Настраиваемая фильтрация**: Возможность выбрать тип фильтрации (dictionary, enum, roles ...).
- **Глобальный поиск**: Примените фильтр глобального поиска по всем столбцам для более широких запросов.

### 📑 Пагинация
- **Настраиваемый размер страницы**: Изменяйте количество записей на странице для работы с различными наборами данных.
- **Навигационные элементы**: Переходите между страницами с помощью кнопок «Предыдущая», «Следующая», «Первая» и «Последняя».

### 🗂️ Вкладки
- **Контекстные вкладки**: Организуйте данные в разные категории для удобного переключения между вкладками.
- **Динамическое обновление**: Содержимое вкладок обновляется автоматически при изменении выбранного критерия.
- **Кеширование вкладок**: При открытии вкладки информация кешируется.

### 🔘 Селекторы
- **Одно- и многовариантный выбор**: Выбирайте отдельные или несколько строк для выполнения массовых действий.
- **Быстрый выбор всех элементов**: Опция «Выбрать всё» для быстрого применения массовых действий к большим наборам данных.
- **Настраиваемые действия**: Выполняйте индивидуальные действия для выбранных элементов, такие как экспорт, удаление или обновление.

### 🖱️ Контекстное меню
- **Кастомное контекстное меню**: при ПКМ открывается набор команд для выбранной строки.
- **Фильтрация по ролям**: набор команд генерируется в зависимости от роли пользователя.

### 🖇️ Динамическое перемещение столбцов (Drag-and-drop)
- **Динамическая смена информации**: при перемещении шапки столбца перемещается весь столбец.
- **Скрытие столбцов**: возможность скрывать ненужные столбцы для повышения удобства просмотра.
- **Динамическое сохранение положения столбцов**: история положения столбцов обновляется автоматически.

### 💾 Кеширование
- **Кеширование вкладок**: запоминает последнюю открытую вкладку при повторном открытии.
- **Кеширование фильтров**: сохраняет набор фильтров во всех вкладках.
- **Кеширование порядка столбцов**: запоминает текущий порядок столбцов в таблице.
- **Кеширование пагинации**: сохраняет активную страницу для каждой вкладки.

---

## Установка

Установите компонент в ваш проект React через npm или yarn:

```bash
npm install react-table-components
# или
yarn add react-table-components
```

## Примеры

### Простой пример обьявления в компоненте:

```
render() {
	return <DataTable {...this.props}
		title = "Уведомления"
		sort = {{field: "created", dir: 'desc'}}
		fetch = {this.fetch.bind(this)}
		columns = {[
			{ title: "#", field: "id", filter: DataTable.STRING_FILTER},
			{ title: "Тема", field: "subject", filter: DataTable.STRING_FILTER},
			{ title: "Описание", field: "body", filter: DataTable.STRING_FILTER},
		]}/>
}
```

### Более сложный пример, включающий вкладки, контекстное меню и выгрузку в Excel:

```
render() {
	return <DataTable {...this.props}
	   contextMenuObj={this.contextMenuObj}
	   filterTabs={filterTabs}
	   defaultFilterParam={field}
	   serviceFilterTabs={QuoteService}
	   title = {this.props.title}
	   openAddForm = {this.openAddForm.bind(this)}
	   openEditForm = {this.openEditForm.bind(this)}
	   fetch = { ... }
	   fetchXLS = {this.fetchXLS.bind(this)}
	   tableHeaderRenderer = {this.renderTableHeader}
	   getQuoteStatuses={this.getQuoteStatuses}
	   tableBodyRenderer = { ... }
	   features = { ... }}
	   resizable = {true}
	   columns = {this.columns().filter(col => { return Object.keys(col).length !== 0 })}
	   style = {{maxHeight: this.state.tableHeight}}
	   tableClassName = "no-line-break"
	   dataTableAlerts = {this.state.dataTableAlerts}
	   dataTableNotifications = {this.state.dataTableNotifications}
	   alertClickHandler = {this.openEditForm.bind(this)}
	   alertItemTitle={"Заявка"}
	   setColumns = {this.setColumns}
	/>
	}
}
```


