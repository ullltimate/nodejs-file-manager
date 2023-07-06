import process from 'node:process';
import { stdin, stdout } from 'node:process';

let userName;

const appFileManager = async () => {
    try {
        greeting();
        linstenerConsole();
    } catch(err){
        console.error('Error:', err);
    }
}
const greeting = async () => {
    const arg = process.argv.splice(2);
    const username = arg.join('').split('--username=')[1];
    if (!username){
        throw new Error(
            `Please add correct username. Here the format "--username=your_username".`
          );
    }
    userName = username;
    console.log(`Welcome to the File Manager, ${userName}!`);
};

const linstenerConsole = async () => {
    stdout.write('Writing your command:\n');

    stdin.on('data', data => {
        
        if (data.toString().trim() == 'exit'){
            process.exit();
        }
        process.on('SIGINT', () => process.exit());
    });

    process.on('exit', () => stdout.write(`Thank you for using File Manager, ${userName}, goodbye!\n`));
}

await appFileManager();