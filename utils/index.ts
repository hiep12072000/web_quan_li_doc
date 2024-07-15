import Big from 'big.js';
import dayjs from 'dayjs';
import isNil from 'lodash/isNil';
import keys from 'lodash/keys';

export const enumObject = (
  e: { [key: string]: string },
  option?: { valueIsString: boolean },
) => {
  const { valueIsString = false } = option ?? {};
  const result: { [key: string]: string } = {};

  Object.keys(e)
    .filter((val) => {
      return valueIsString ? true : isNaN(Number(val)) === false;
    })
    .forEach((key) => {
      result[key] = e[key];
    });

  return result;
};

export const enum2OptionsSelect = (
  e: { [key: string]: string },
  options?: {
    blankValue?: boolean;
    keyIsString?: boolean;
    valueIsString?: boolean;
  },
) => {
  const {
    blankValue = false,
    keyIsString = false,
    valueIsString = false,
  } = options ?? {};

  const result = [];
  if (blankValue) {
    result.push({
      code: '',
      label: '---',
    });
  }
  const object = enumObject(e, { valueIsString });

  Object.keys(object).forEach((key) => {
    result.push({
      code: isNaN(Number(key)) || keyIsString ? key : Number(key),
      label: object[key] === '-' && key === '0' ? '---' : object[key],
    });
  });

  return result;
};

export const enumToSelectOptions = (input: any) =>
  keys(input).reduce(
    (result, key) => {
      if (!isNaN(Number(key))) {
        result.push({
          value: key,
          label: input[key],
        });
      }
      return result;
    },
    [] as { label: string; value: string }[],
  );

export const date = (string?: string | Date | null, pattern = 'DD/MM/YYYY') => {
  if (isNil(string)) {
    return <string>string!;
  }
  const date = dayjs(string);
  if (date.isValid()) {
    return date.format(pattern).toString();
  }
  return <string>string;
};

const addCommaToNumber = (value: number | string) => {
  if (isNil(value)) {
    return value;
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const number = (
  value?: Big | number | string,
  isCurrency = false,
  editable = false,
) => {
  if (editable) return value;
  if (value === null || value === undefined) {
    return '';
  }
  const prefix = isCurrency ? '￥ ' : '';
  let temp = '';
  if (value instanceof Big) {
    temp = addCommaToNumber(value.toFixed());
  } else {
    temp = addCommaToNumber(value);
  }
  return temp.length > 0 ? `${prefix}${temp}` : '';
};

export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export function downloadFile(base64String: string, filename: string) {
  const a = document.createElement('a');
  a.href = base64String;
  a.download = filename || 'download';
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(base64String);
      a.removeEventListener('click', clickHandler);
    }, 150);
  };
  a.addEventListener('click', clickHandler, false);
  a.click();
  return a;
}
