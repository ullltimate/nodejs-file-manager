import process from 'node:process';
import { stdin, stdout } from 'node:process';
import { cwd } from 'node:process';
import { homedir } from 'node:os';

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
    stdout.write(`You are currently in ${cwd()}\n`);
    stdout.write(`Please enter the command:\n`);

    stdin.on('data', data => {
        switch(data.toString().split(' ')[0].trim()){
            case 'up':
                up();
                break;
            case 'cd':
                if(!data.toString().split(' ')[1].trim()){
                    console.log('Please add correct command');
                } else{
                    cd(data.toString().split(' ')[1].trim());
                }
                break;
            case 'exit':
                process.exit();
            default:
                console.log('Please add correct command');
            }
        //if (data.toString().trim() === 'up'){
        //    up();
        //}
        //if (data.toString().trim() === 'exit'){
        //    process.exit();
        //}
        stdout.write(`You are currently in ${cwd()}\n`);
        console.log();
    });
    process.on('SIGINT', () => process.exit());
    process.on('exit', () => stdout.write(`\nThank you for using File Manager, ${userName}, goodbye!\n`));
}

const up = () => {
    process.chdir('../');
}
const cd = async (path) =>{
    try {
        process.chdir(path);
    } catch (error) {
        console.error(new Error(`Operation failed`));
    }
}
await appFileManager();