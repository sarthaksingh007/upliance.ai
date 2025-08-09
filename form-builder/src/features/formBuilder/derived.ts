import type { FieldBase } from '../../lib/schema';

type Ctx = Record<string, any>;

export function evalDerived(expression: string, ctx: Ctx) {
    // Extremely small sandbox. In production, consider a proper expression parser.
    const allowed = { Math, Date };
    const fn = new Function(
        'ctx',
        'allowed',
        `"use strict";
         const { Math, Date } = allowed;
         with (ctx) { return (${expression}); }`
    );
    return fn(ctx, allowed);
}

export function buildCtx(fields: FieldBase[], values: Record<string, any>): Ctx {
    const ctx: Ctx = {};
    for (const f of fields) {
        const key = f.id; // use id as variable name in ctx via with(ctx)
        ctx[key] = values[key];
    }
    return ctx;
}

export function detectCycle(fields: FieldBase[]): string[] {
    const graph: Record<string, string[]> = {};
    for (const f of fields) {
        graph[f.id] = f.derived?.enabled ? (f.derived.parents || []) : [];
    }
    const visited: Record<string, 0 | 1 | 2> = {};
    const cycle: string[] = [];
    function dfs(n: string): boolean {
        visited[n] = 1;
        for (const m of graph[n] || []) {
            if (visited[m] === 0 || visited[m] === undefined) {
                if (dfs(m)) { cycle.push(m); return true; }
            } else if (visited[m] === 1) { cycle.push(m); return true; }
        }
        visited[n] = 2;
        return false;
    }
    for (const n of Object.keys(graph)) {
        if (!visited[n]) {
            if (dfs(n)) return cycle.reverse();
        }
    }
    return [];
}