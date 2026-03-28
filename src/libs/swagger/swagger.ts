import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as PostmanConverter from 'openapi-to-postmanv2';
import fs from 'fs';
import { HttpService } from '@nestjs/axios';

export const initSwagger = async (app: INestApplication) => {
  const logger = new Logger('SwaggerInit');
  const config = new DocumentBuilder()
    .setTitle('authentication-v2')
    .setVersion('2.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const swaggerJson = await new Promise((resolve, reject) => {
    PostmanConverter.convert(
      {
        data: document,
        type: 'json',
      },
      { schemaFaker: true },
      (err, res) => {
        if (err) {
          logger.error('Converter error:', err);
          reject(new Error('Conversion fail'));
          return;
        }
        if (!res?.result) {
          logger.error('Conversion fail:', res?.reason);
          reject(new Error('Conversion fail'));
          return;
        }
        if (Array.isArray(res?.output) && res?.output.length !== 0) {
          fs.writeFileSync(
            './postman_collection.json',
            JSON.stringify(res?.output[0].data, null, 2),
          );
          resolve(res?.output[0].data);
        }
      },
    );
  });

  SwaggerModule.setup('api', app, document);

  const httpsService = app.get(HttpService);

  httpsService.put(
    `https://api.getpostman.com/collections/${process.env.POSTMAN_COLLECTION_ID}`,
    {
      collection: swaggerJson,
    },
    {
      headers: { 'X-Api-Key': process.env.POSTMAN_API_KEY },
    },
  );
};
