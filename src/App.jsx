// 1. Импорты
import { useEffect, useState } from "react";

// 2. Адреса API 1С
const API_URL = "/InfoBase1/hs/ibg/lc";
const GENERATE_URL = "/InfoBase1/hs/ibg/gen";

// 3. Описание выпадающих списков
const fields = [
  {
    name: "configuration",
    label: "Конфигурация",
    placeholder: "Выберите конфигурацию",
  },
  {
    name: "region",
    label: "Регион",
    placeholder: "Выберите регион",
  },
  {
    name: "business",
    label: "Направление бизнеса",
    placeholder: "Выберите направление",
  },
  {
    name: "goal",
    label: "Цель использования",
    placeholder: "Выберите цель",
  },
];

// 4. Начальные данные списков
const emptyLists = {
  configuration: [],
  region: [],
  business: [],
  goal: [],
};

// 5. Начальные данные формы
const emptyForm = {
  configuration: "",
  region: "",
  business: "",
  goal: "",
  fio: "",
  date: "",
};

// 6. Вспомогательные функции
function getKey(item) {
  return Object.keys(item)[0];
}

function getValue(item) {
  return Object.values(item)[0];
}

function formatDateFor1C(dateValue) {
  return dateValue.replaceAll("-", "");
}

function getRequiredErrors(form) {
  const errors = {};

  for (const field of fields) {
    if (!form[field.name]) {
      errors[field.name] = "Обязательное поле";
    }
  }

  if (!form.fio.trim()) {
    errors.fio = "Обязательное поле";
  } else if (!/^[A-Z]+$/.test(form.fio.trim())) {
    errors.fio = "Введите фамилию английскими заглавными буквами";
  }

  if (!form.date) {
    errors.date = "Обязательное поле";
  }

  return errors;
}

// 7. Основной компонент приложения
function App() {
  const [lists, setLists] = useState(emptyLists);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [generatedName, setGeneratedName] = useState("");

  // При открытии страницы загружаем списки из 1С
  useEffect(() => {
    loadLists();
  }, []);

  // 8. Загрузка данных из 1С
  async function loadLists() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      setLists({
        configuration: data.configuration || [],
        region: data.region || [],
        business: data.business || [],
        goal: data.goal || [],
      });
    } catch (error) {
      setError("Не удалось загрузить данные из 1С");
      console.error(error);
    }
  }

  // 9. Изменение данных формы
  function handleChange(fieldName, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [fieldName]: value,
    }));

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: "",
    }));
  }

  // 10. Копирование результата
  async function copyResult() {
    try {
      await navigator.clipboard.writeText(generatedName);
      alert("Сформированная строка скопирована");
    } catch (error) {
      console.error(error);
      alert("Не удалось скопировать строку");
    }
  }

  // 11. Нажатие кнопки
  async function handleSubmit() {
    const errors = getRequiredErrors(form);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const dataFor1C = [
      { configuration: form.configuration },
      { region: form.region },
      { business: form.business },
      { goal: form.goal },
      { fio: form.fio.trim() },
      { date: formatDateFor1C(form.date) },
    ];

    try {
      const response = await fetch(GENERATE_URL, {
        method: "POST",
        body: JSON.stringify(dataFor1C),
      });

      const data = await response.json();

      setGeneratedName(data.result || "");
      setError("");

      console.log("Отправили в 1С:", dataFor1C);
      console.log("Ответ от 1С:", data);
    } catch (error) {
      setError("Ошибка отправки данных в 1С");
      console.error(error);
    }
  }

  // 12. Интерфейс страницы
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>Генератор имени базы</h1>

        {error && <p style={styles.error}>{error}</p>}

        {/* Выпадающие списки */}
        {fields.map((field) => (
          <div key={field.name} style={styles.field}>
            <label style={styles.label}>
              {field.label}<span style={styles.required}>*</span>
            </label>

            <select
              style={{
                ...styles.select,
                ...(fieldErrors[field.name] ? styles.inputError : {}),
              }}
              value={form[field.name]}
              onChange={(event) =>
                handleChange(field.name, event.target.value)
              }
            >
              <option value="">{field.placeholder}</option>

              {lists[field.name].map((item) => (
                <option key={getKey(item)} value={getKey(item)}>
                  {getValue(item)}
                </option>
              ))}
            </select>

            {fieldErrors[field.name] && (
              <p style={styles.fieldError}>{fieldErrors[field.name]}</p>
            )}
          </div>
        ))}

        {/* Поле фамилии */}
        <div style={styles.field}>
          <label style={styles.label}>
            Фамилия на английском<span style={styles.required}>*</span>
          </label>

          <input
            style={{
              ...styles.select,
              ...(fieldErrors.fio ? styles.inputError : {}),
            }}
            type="text"
            placeholder="Например: KIRUPINA"
            value={form.fio}
            maxLength={100}
            onChange={(event) => {
              const value = event.target.value
                .replace(/[^A-Za-z]/g, "")
                .toUpperCase();

              handleChange("fio", value);
            }}
          />

          {fieldErrors.fio && (
            <p style={styles.fieldError}>{fieldErrors.fio}</p>
          )}
        </div>

        {/* Поле даты */}
        <div style={styles.field}>
          <label style={styles.label}>
            Дата<span style={styles.required}>*</span>
          </label>

          <input
            style={{
              ...styles.select,
              ...(fieldErrors.date ? styles.inputError : {}),
            }}
            type="date"
            value={form.date}
            onChange={(event) => handleChange("date", event.target.value)}
          />

          {fieldErrors.date && (
            <p style={styles.fieldError}>{fieldErrors.date}</p>
          )}
        </div>

        <p style={styles.requiredText}>* — обязательное поле к заполнению</p>

        {/* Кнопка */}
        <button style={styles.button} onClick={handleSubmit}>
          Сгенерировать
        </button>

        {/* Блок выбранных значений */}
        <div style={styles.result}>
          <h2 style={styles.resultTitle}>Выбранные значения</h2>

          {fields.map((field) => (
            <p key={field.name} style={styles.resultLine}>
              <b>{field.label}:</b> {form[field.name] || "не выбрано"}
            </p>
          ))}

          <p style={styles.resultLine}>
            <b>Фамилия:</b> {form.fio || "не введено"}
          </p>

          <p style={styles.resultLine}>
            <b>Дата:</b> {form.date || "не выбрана"}
          </p>
        </div>

        {/* Блок результата от 1С */}
        {generatedName && (
          <div style={styles.result}>
            <h2 style={styles.resultTitle}>Сформированная строка</h2>

            <input
              style={styles.resultInput}
              value={generatedName}
              readOnly
            />

            <button style={styles.copyButton} onClick={copyResult}>
              Скопировать
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

// ==============================
// 13. Стили
// ==============================
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
  },
  card: {
    width: "420px",
    padding: "28px",
    border: "1px solid #ddd",
    borderRadius: "12px",
  },
  title: {
    textAlign: "center",
    fontSize: "48px",
    lineHeight: "60px",
    marginBottom: "30px",
  },
  field: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "bold",
  },
  required: {
    color: "red",
    marginLeft: "2px",
  },
  requiredText: {
    marginTop: "4px",
    marginBottom: "16px",
    fontSize: "13px",
    color: "#666",
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "15px",
    boxSizing: "border-box",
    border: "1px solid #aaa",
    borderRadius: "4px",
  },
  inputError: {
    border: "2px solid red",
  },
  fieldError: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "red",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
  result: {
    marginTop: "24px",
    padding: "14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  resultTitle: {
    marginTop: 0,
    fontSize: "18px",
  },
  resultLine: {
    margin: "8px 0",
  },
  resultInput: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    boxSizing: "border-box",
    marginBottom: "10px",
  },
  copyButton: {
    width: "100%",
    padding: "10px",
    fontSize: "15px",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
};

export default App;