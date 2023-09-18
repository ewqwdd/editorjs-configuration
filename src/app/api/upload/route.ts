import { NextRequest } from "next/server";
import {nanoid} from 'nanoid'
import { S3Client, PutObjectCommand, GetObjectCommand,} from "@aws-sdk/client-s3";
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'


const s3 = new S3Client({
    region: 'eu-west-2',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });

export async function POST(req: NextRequest){
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];

    let res: {url: string}[] = []
      
    const response = await Promise.all(
      files.map(async (file) => {
        const Body = (await file.arrayBuffer()) as Buffer;
        let fileArr = file.name.split('.')
        let end = fileArr[fileArr.length-1]
        let fileTypes = ['png', 'jpg', 'jpeg', 'webp', 'svg']
        if(!fileTypes.includes(end)) return new Response('Invalid type', {status: 422})
        let key = nanoid()
        await s3.send(new PutObjectCommand({ Bucket: 'shap-gallery' , Key: `gallery/${key}.${end}`, Body }));

        let url = `https://shap-gallery.s3.eu-west-2.amazonaws.com/gallery/${key}.${end}`
        res.push({
          url
        })
      })
    )
    return new Response(JSON.stringify(res))
    
}