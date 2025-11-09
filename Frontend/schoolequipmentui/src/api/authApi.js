import { from } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { BASE_URL } from '../common/env.js';

export const loginApi = (credentials) => {
  return from(
    ajax.post(`${BASE_URL}/login`, credentials, { 'Content-Type': 'application/json' }).pipe(
      map((res) => res.response)
    )
  );
};
