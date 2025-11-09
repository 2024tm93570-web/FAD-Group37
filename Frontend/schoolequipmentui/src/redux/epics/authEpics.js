import { ofType } from 'redux-observable';
import { mergeMap, map, catchError, of } from 'rxjs';
import { LOGIN_REQUEST } from '../constants/authConstants.js';
import { loginSuccess, loginFailure } from '../actions/authActions.js';
import { loginApi } from '../../api/authApi.js';
import { transformAuthResponse } from '../../common/transformer/authTransformer.js';

export const loginEpic = (action$) =>
  action$.pipe(
    ofType(LOGIN_REQUEST),
    mergeMap((action) =>
      loginApi(action.payload).pipe(
        map((response) => loginSuccess(transformAuthResponse(response))),
        catchError((error) => of(loginFailure(error.message || 'Login failed')))
      )
    )
  );
