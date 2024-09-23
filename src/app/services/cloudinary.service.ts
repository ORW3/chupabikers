import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private apiSecret = environment.apiSecret;
  private apiKey = environment.apiKey;
  private cloudName = environment.cloudName;

  constructor(private http: HttpClient) { }

  generateSignature(params: { [key: string]: any }): string {
    const { file, cloud_name, resource_type, api_key, ...paramsToSign } = params;

    if (!paramsToSign['timestamp']) {
      paramsToSign['timestamp'] = Math.round((new Date()).getTime() / 1000);
    }

    const sortedParams = Object.keys(paramsToSign).sort().reduce(
      (acc, key) => {
        acc[key] = paramsToSign[key];
        return acc;
      },
      {} as { [key: string]: any }
    );

    const stringToSign = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&') + this.apiSecret;

    return CryptoJS.SHA1(stringToSign).toString();
  }

  destroyResource(publicId: string, resourceType: string = 'image'): Observable<any> {
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const params = {
      public_id: publicId,
      timestamp: timestamp,
      api_key: this.apiKey
    };

    const signature = this.generateSignature(params);

    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/${resourceType}/destroy`;

    const body = new HttpParams()
      .set('public_id', publicId)
      .set('signature', signature)
      .set('timestamp', timestamp.toString())
      .set('api_key', this.apiKey);

    return this.http.post(url, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }
}