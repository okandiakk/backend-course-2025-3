const { Command } = require('commander');
const fs = require('fs');

const program = new Command();

program
  .requiredOption('-i, --input <path>', 'input file path')
  .option('-o, --output <path>', 'output file path')
  .option('-d, --display', 'display result')
  .option('-s, --survived', 'show only survivors')
  .option('-a, --age', 'show age');

program.parse();
const options = program.opts();

if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(options.input, 'utf8'));

let filtered = data;

// Фільтр за виживанням
if (options.survived) {
  filtered = data.filter(passenger => passenger.Survived === 1);
}

// Формування результату
let result = filtered.map(passenger => {
  let line = passenger.Name;
  if (options.age) {
    line += ' ' + (passenger.Age || '');
  }
  line += ' ' + passenger.Ticket;
  return line;
}).join('\n');

// Вивід результату
if (options.display) {
  console.log(result);
}

if (options.output) {
  fs.writeFileSync(options.output, result);
}

// Якщо не задано ні -d, ні -o, нічого не виводимо
if (!options.display && !options.output) {
  // Нічого не робимо
}
