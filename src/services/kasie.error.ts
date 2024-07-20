import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HttpException } from '@nestjs/common';

@Schema({
  timestamps: true,
  collection: 'KasieError',
})
/**
 * Error that occurs in the backend code
 */
export class KasieError extends HttpException {
  _partitionKey: string;
  _id: string;
  @Prop()
  statusCode: number;
  @Prop()
  message: string;
  @Prop()
  date: string;
  @Prop()
  request: string;

  constructor(statusCode: number, message: string, request: string) {
    super(`${message} - ${request}`, statusCode);
    this.statusCode = statusCode;
    this.message = message;
    this.date = new Date().toISOString();
    this.request = request;
  }
}
export const KasieErrorSchema = SchemaFactory.createForClass(KasieError);
