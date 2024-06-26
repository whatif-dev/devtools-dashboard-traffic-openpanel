import { createTRPCRouter, protectedProcedure } from '@/trpc/api/trpc';
import { z } from 'zod';

import { db } from '@openpanel/db';
import { zChartInput } from '@openpanel/validation';

export const reportRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        report: zChartInput.omit({ projectId: true }),
        dashboardId: z.string(),
      })
    )
    .mutation(async ({ input: { report, dashboardId } }) => {
      const dashboard = await db.dashboard.findUniqueOrThrow({
        where: {
          id: dashboardId,
        },
      });
      return db.report.create({
        data: {
          projectId: dashboard.projectId,
          dashboardId,
          name: report.name,
          events: report.events,
          interval: report.interval,
          breakdowns: report.breakdowns,
          chartType: report.chartType,
          lineType: report.lineType,
          range: report.range,
          formula: report.formula,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        reportId: z.string(),
        report: zChartInput.omit({ projectId: true }),
      })
    )
    .mutation(({ input: { report, reportId } }) => {
      return db.report.update({
        where: {
          id: reportId,
        },
        data: {
          name: report.name,
          events: report.events,
          interval: report.interval,
          breakdowns: report.breakdowns,
          chartType: report.chartType,
          lineType: report.lineType,
          range: report.range,
          formula: report.formula,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        reportId: z.string(),
      })
    )
    .mutation(({ input: { reportId } }) => {
      return db.report.delete({
        where: {
          id: reportId,
        },
      });
    }),
});
