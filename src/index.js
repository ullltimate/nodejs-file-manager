import process from 'node:process';
import { stdin, stdout, cwd } from 'node:process';
import fs from 'fs/promises';
import { statSync, createReadStream, createWriteStream } from 'node:fs';
import { sep } from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { pipeline } from 'node:stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';

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
            case 'ls':
                ls();
                break;
            case 'cat':
                if(!data.toString().split(' ')[1].trim()){
                    console.log('Please add correct command');
                } else{
                    cat(data.toString().split(' ')[1].trim());
                }
                break;
            case 'add':
                if(!data.toString().split(' ')[1].trim()){
                    console.log('Please add correct command');
                } else{
                    add(data.toString().split(' ')[1].trim());
                }
                break;
            case 'rn':
                if(!data.toString().split(' ')[1].trim() || !data.toString().split(' ')[2].trim()){
                    console.log('Please add correct command');
                } else{
                    rn(data.toString().split(' ')[1].trim(), data.toString().split(' ')[2].trim());
                }
                break;
            case 'cp':
                if(!data.toString().split(' ')[1].trim() || !data.toString().split(' ')[2].trim()){
                    console.log('Please add correct command');
                } else{
                    cp(data.toString().split(' ')[1].trim(), data.toString().split(' ')[2].trim());
                }
                break;
            case 'rm':
                if(!data.toString().split(' ')[1].trim()){
                    console.log('Please add correct command');
                } else{
                    rm(data.toString().split(' ')[1].trim());
                }
                break;
            case 'mv':
                if(!data.toString().split(' ')[1].trim() || !data.toString().split(' ')[2].trim()){
                    console.log('Please add correct command');
                } else{
                    mv(data.toString().split(' ')[1].trim(), data.toString().split(' ')[2].trim());
                }
                break;
            case 'os':
                if(!data.toString().split(' ')[1].trim()){
                    console.log('Please add correct command');
                } else{
                    osInfo(data.toString().split(' ')[1].trim());
                }
                break;
            case 'hash':
                if(!data.toString().split(' ')[1].trim()){
                    console.log('Please add correct command');
                } else{
                    hash(data.toString().split(' ')[1].trim());
                }
                break;
            case 'compress':
                if(!data.toString().split(' ')[1].trim() || !data.toString().split(' ')[2].trim()){
                    console.log('Please add correct command');
                } else{
                    compress(data.toString().split(' ')[1].trim(), data.toString().split(' ')[2].trim());
                }
                break;
            case 'decompress':
                if(!data.toString().split(' ')[1].trim() || !data.toString().split(' ')[2].trim()){
                    console.log('Please add correct command');
                } else{
                    decompress(data.toString().split(' ')[1].trim(), data.toString().split(' ')[2].trim());
                }
                break;
            case '.exit':
                process.exit();
            default:
                console.log('Please add correct command');
        }
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

const ls = async () => {
    let path = cwd();
    let files;
    try {
        files = await fs.readdir(path);
    } catch (error) {
        console.error(new Error(`Operation failed`));
    }
    const finalTable = sortFiles(files).map((elem) => new Table(elem));
    console.table(finalTable);
}

function Table(name){
    this.Name = name;
    this.Type = isFile(name) ? 'file' : isDirectory(name) ? 'directory' : 'unknow';
}

function isDirectory(path){
   return statSync(path).isDirectory();
}

function isFile(path){
    return statSync(path).isFile();
}

function sortFiles(files){
    const onlyFolders = files.filter((el) => isDirectory(el));
    const onlyFiles = files.filter((el) => isFile(el));
    return onlyFolders.concat(onlyFiles);
}

const cat = (path) => {
    const readStream = createReadStream(path);
    readStream.pipe(stdout);
}

const add = async (nameFile) => {
    try {
        await fs.writeFile(nameFile, '');
    } catch (error) {
        console.error(new Error(`Operation failed`));
    }
}

const rn = async (nameFile, newName) => {
    const path = `${cwd()}${sep}${nameFile}`
    try {
        await fs.rename(path, newName);
    } catch (error) {
        console.error(new Error(`Operation failed`));
    }
}

const cp = (pathToFile, pathToNewDir) => {
    const readStream = createReadStream(pathToFile, 'utf-8');
    const writeStream = createWriteStream(pathToNewDir, 'utf-8')
    readStream.pipe(writeStream);
}

const rm = async (path) => {
    try {
        await fs.unlink(path);
    } catch (error) {
        console.error(new Error(`Operation failed`));
    }
}

const mv = (pathToFile, pathToNewDir) => {
    cp(pathToFile, pathToNewDir);
    rm(pathToFile);
}

const osInfo = (command) => {
    switch(command){
        case '--EOL':
            console.log(os.EOL);
            break;
        case '--cpus':
            console.log(os.cpus());
            break;
        case '--homedir':
            console.log(os.homedir());
            break;
        case '--username':
            console.log(os.userInfo().username)
            break;
        case '--architecture':
            console.log(os.arch());
            break;
        default:
            console.log('Please add correct command');
    }
}

const hash = async (path) => {
    const hash = createHash('sha256');
    const data = await fs.readFile(path, {encoding: 'utf8'})
    hash.update(data);
    console.log(hash.digest('hex'));
}

const compress = async (pathFile, pathDestination) => {
    const readStream = createReadStream(pathFile);
    const writeSream = createWriteStream(pathDestination);
    try {
        await pipeline(readStream, createBrotliCompress(), writeSream,);
    } catch(err){
        console.error(new Error(`Operation failed`));
    }
}

const decompress = async (pathFile, pathDestination) => {
    const readStream = createReadStream(pathFile);
    const writeSream = createWriteStream(pathDestination);
    try {
        await pipeline(readStream, createBrotliDecompress(), writeSream,);
    } catch(err){
        console.error(new Error(`Operation failed`));
    }
}

await appFileManager();