import Util from "../../utils/util/Util";

class TableCell {

	static getFormatter(type) {
		let formatter = null;
		switch (type) {
			case "date": {
				formatter = TableCell.dtFormatter;
				break;
			}
			case "day": {
				formatter = TableCell.dayFormatter;
				break;
			}
			case "array": {
				formatter = TableCell.arrayFormatter;
				break;
			}
			case "options": {
				formatter = TableCell.optionsFormatter;
				break;
			}
			case "boolean": {
				formatter = TableCell.booleanFormatter;
				break;
			}
			case "enum": {
				formatter = TableCell.enumFormatter;
				break;
			}
			case "decimal": {
				formatter = TableCell.decimalFormatter;
				break;
			}
			case "phone": {
				formatter = TableCell.phoneFormatter;
				break;
			}
		}
		return formatter;
	}

	static dtFormatter = dt => {
		if (!dt) {
			return '';
		}
		const date = typeof(dt) === "string" ? new Date(dt) : dt,
			dateString = date.toLocaleDateString('ru-RU'),
			hours = date.getHours(),
			minutes = date.getMinutes(),
			padZero = num => num < 10 ? '0' + num : num;
		return `${dateString} ${padZero(hours)}:${padZero(minutes)}`;
	}

	static dayFormatter = dt => {
		if (!dt) {
			return '';
		}
		const date = typeof(dt) === "string" ? new Date(dt) : dt;
		return date.toLocaleDateString('ru-RU');
	}

	static arrayFormatter = arr => arr ? arr.join(", ") : "";

	static optionsFormatter = arr => arr ? arr.map(el => el.value).join(", ") : "";

	static booleanFormatter = flag => flag ? "да" : "нет";

	static strBooleanFormatter = flag => flag === "true" ? "да" : "нет";

	static enumFormatter = targetEnum => value => targetEnum[value]?.label;

	static decimalFormatter = value => Util.formatDecimal(value);

	static phoneFormatter = value => {
		if (!value) {
			return '';
		}
		const replaceValue = value.replace(/[78]/, '').replace(/\D/g, '');
		return `+7-(${replaceValue.slice(0, 3)})${replaceValue.slice(3, 6)}-${replaceValue.slice(6, 8)}-${replaceValue.slice(8, 10)}`;
	};
}

export default TableCell;