 
const { Command } = require('commander');
const fs = require('fs');
const program = new Command();

program
.requiredOption('-i, --input <path>', 'input file path')
.option('-o, --output <path>', 'output file path')
.option('-d, --display', 'display result')
.option('-s, --survived', 'show only survived passengers')
.option('-a, --age', 'show age');

program.configureOutput({
    outputError: (e) => {
        if ((e.includes("required option") || e.includes("argument missing")) && e.includes("--input")) {
            console.error("Please, specify input file");
        } else if (e.includes("argument missing") && e.includes("--output")) {
            console.error("Please, specify output file");
        } else {
            console.error(e);
        }
    }
});

program.parse();

const options = program.opts();

// Перевірка існування файлу
if (!fs.existsSync(options.input)) {
    console.error("Cannot find input file");
    process.exit(1);
}

let data;
try {
    const fileContent = fs.readFileSync(options.input, 'utf8');
    data = fileContent.trim().split('\n').map(line => JSON.parse(line));
} catch (error) {
    console.error("Error reading input file");
    process.exit(1);
}

// Фільтрація за survived
let filtered = data;
if (options.survived) {
    filtered = data.filter(passenger => passenger.Survived === "1");
}

// Формування результату
let result = filtered.map(passenger => {
    let parts = [];

    // Додаємо ім'я завжди
    parts.push(passenger.Name);

    // Якщо вказано параметри -a або -s, показуємо тільки вибрані поля
    if (options.age || options.survived) {
        if (options.age) {
            parts.push(passenger.Age);
        }
        // Номер квитка додаємо завжди при фільтрації
        parts.push(passenger.Ticket);
    } else {
        // Якщо не вказано жодного параметра, показуємо ВСЕ
        parts.push(passenger.PassengerId);
        parts.push(passenger.Survived);
        parts.push(passenger.Pclass);
        parts.push(passenger.Sex);
        parts.push(passenger.Age);
        parts.push(passenger.SibSp);
        parts.push(passenger.Parch);
        parts.push(passenger.Ticket);
        parts.push(passenger.Fare);
        parts.push(passenger.Cabin);
        parts.push(passenger.Embarked);
    }

    return parts.join(' ');
}).join('\n');

if (!options.display && !options.output) {
    console.log(result);
}

// Вивід результату
if (options.display) {
    console.log(result);
}

if (options.output) {
    fs.writeFileSync(options.output, result, 'utf8');
}
