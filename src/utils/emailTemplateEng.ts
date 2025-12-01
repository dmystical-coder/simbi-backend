import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

export function compileTemplate(templateName: string, context: object): string {
  const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.hbs`);
  const source = fs.readFileSync(templatePath, 'utf-8');
  const template = handlebars.compile(source);
  return template(context);
}