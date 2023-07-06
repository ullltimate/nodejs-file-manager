import process from 'node:process';

const appFileManager = async () => {
    try {
        greeting();
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
    console.log(`Welcome to the File Manager, ${username}!`);
};

await appFileManager();