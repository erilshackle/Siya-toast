
# Seeya

Minimal, elegant toast notifications for modern web apps.

Inspired by Sonner.

---

## Install

```bash
npm install seeya
````

---

## Usage

```js
import Seeya from 'seeya';
import 'seeya/style.css';

Seeya.init();

Seeya.success('Saved!');
```

---

## Actions

```js
Seeya.action(
  "Undo delete",
  "Item removed",
  {
    label: "Undo",
    onClick: () => console.log("undo")
  }
);
```

---

## Promise

```js
Seeya.promise(saveUser(), {
  loading: "Saving...",
  success: "Saved!",
  error: "Failed"
});
```

---

## Confirm

```js
Seeya.confirm("Delete file?", {
  onConfirm: () => deleteFile()
});
```

---

## License

MIT
