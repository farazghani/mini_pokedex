import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from "@angular/common/http";
import { provideEchartsCore } from "ngx-echarts";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import { routes } from './app.routes';

import {GridComponent,TooltipComponent,LegendComponent}  from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
  ]); 

  

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideEchartsCore({ echarts }),
  ]
};

