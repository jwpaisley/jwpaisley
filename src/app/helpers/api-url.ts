import { isDevMode } from '@angular/core';

export function getApiUrl(localApiUrl: string, prodApiUrl: string, useLocalApi: boolean = isDevMode()): string {
  return useLocalApi ? localApiUrl : prodApiUrl;
}
