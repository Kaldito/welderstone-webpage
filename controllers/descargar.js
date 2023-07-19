/*
const {content} = require("../pdf/pdfContent")


const download = require('download');

module.exports = async (req, res) => {
    const IdTransaccion = req.query.IdTrans;

    res.download('pdfs/' + IdTransaccion + `${req.query.Codigo}` + '.pdf');
};
*/

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path'); // Importamos el módulo path

module.exports = async (req, res) => {
  const IdTransaccion = req.query.IdTrans;
  const bucketName = 'welderstonebucket'; // Replace with your S3 bucket name
  const s3FileName = `${IdTransaccion}${req.query.Codigo}.pdf`; // Name of the file in S3
  const localFilePath = `pdfs/${IdTransaccion}${req.query.Codigo}.pdf`; // Local path where the downloaded file will be saved
  console.log(localFilePath + '1');

  // Configure AWS credentials (Access Key ID and Secret Access Key)
  AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  });

  // Configure the region where you created your S3 bucket (e.g., 'us-west-1')
  const s3 = new AWS.S3({ region: 'us-west-1' });

  // Download the file from S3
  const downloadFile = () => {
    const params = {
      Bucket: bucketName,
      Key: s3FileName,
    };

    const fileStream ='https://welderstonebucket.s3.amazonaws.com/pdfs/6494fd4c58c2cdf149dda736AWS.pdf'

    const s3Stream = s3.getObject(params).createReadStream();

    s3Stream.on('error', (err) => {
      console.error('Error downloading the file from S3:', err.message);
      res.status(500).send('An error occurred while downloading the file from S3.');
    });

    s3Stream.pipe(fileStream);

    fileStream.on('finish', () => {
      console.log('File downloaded successfully.');

      // Obtenemos la extensión del archivo original
      const fileExtension = path.extname(s3FileName);

      // Establecemos la extensión del archivo al descargarlo
      res.status(200).download(localFilePath, `archivo${fileExtension}`);
    });

    fileStream.on('error', (err) => {
      console.error('Error saving the downloaded file:', err.message);
      res.status(500).send('An error occurred while saving the downloaded file.');
    });
  };

  downloadFile();
};