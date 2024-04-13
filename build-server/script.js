const {exec} = require('child_process');
const path = require('path');
const {} = require('@aws-sdk/client-s3');
const { mime } = require('mime-types');


const s3Client = new S3Client({
    region: 'us-east-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const PROJECT_ID = process.env.PROJECT_ID;

async function init(){
    console.log('Running build script...');
    const outDirPath = path.join(__dirname, 'output');

    const p = exec('cd ${outDirPath} && npm install && npm run build');
    
    // logs the output of the build
    p.stdout.on('data', (data) => {
        console.log(data.toString());
    }); 
    
    p.stdout.on('error', (data) => {
        console.log("ERROR:", data.toString());
    });

    p.on('close', async function(){
        console.log('Starting upload to S3...');
        const distFolderPath = path.join(__dirname, 'output', 'dist');
        // Read the static files in the dist folder
        const disFolderContent = fs.readdirSync(distFolderPath, {recursive: true});

        // Get all the build files and upload to S3
        for (const file of disFolderContent){
            if(fs.lstatSync(file).isDirectory()){
                continue;
            }
            console.log('Uploading', filePath, '...');
            const filePath = path.join(distFolderPath, file);
            const fileContent = fs.createReadStream(filePath, 'utf-8');
            const command = new PutObjectCommand({
                Bucket: 'my-bucket',
                Key: `__outputs/${PROJECT_ID}/${filePath}`,
                Body: fileContent,
                ContentType: mime.contentType(filePath)
            });
            await s3Client.send(command); 
        }
        console.log('Upload to S3 completed...');

    });

}

init();