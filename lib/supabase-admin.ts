import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Server-side only Supabase client with local file fallback
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isMock = !supabaseUrl || supabaseUrl.includes('YOUR_PROJECT_REF') || supabaseUrl.includes('placeholder');

// Real client (if configured)
const realClient = !isMock
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

// Determine writable directory for mock database
function getDbFilePath(): string {
  try {
    const cwdData = path.join(process.cwd(), '.data');
    if (!fs.existsSync(cwdData)) {
      fs.mkdirSync(cwdData, { recursive: true });
    }
    return path.join(cwdData, 'local-db.json');
  } catch {
    const tmpData = path.join(os.tmpdir(), 'edunet-data');
    if (!fs.existsSync(tmpData)) {
      fs.mkdirSync(tmpData, { recursive: true });
    }
    return path.join(tmpData, 'local-db.json');
  }
}

let inMemoryCache: LocalDB | null = null;

interface LocalDB {
  students: any[];
  exam_sessions: any[];
  assigned_questions: any[];
  student_answers: any[];
  app_settings: Record<string, string>;
}

function loadDB(): LocalDB {
  if (inMemoryCache) return inMemoryCache;
  try {
    const file = getDbFilePath();
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      inMemoryCache = JSON.parse(content);
      return inMemoryCache!;
    }
  } catch (e) {
    console.warn('Fallback to in-memory store:', e);
  }
  inMemoryCache = {
    students: [],
    exam_sessions: [],
    assigned_questions: [],
    student_answers: [],
    app_settings: { exam_enabled: 'true' },
  };
  return inMemoryCache;
}

function saveDB(db: LocalDB) {
  inMemoryCache = db;
  try {
    const file = getDbFilePath();
    fs.writeFileSync(file, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    // In serverless read-only environment, keep in memory
  }
}

function createMockClient() {
  return {
    from: (tableName: string) => {
      let filters: Array<(item: any) => boolean> = [];
      let orderByField: string | null = null;
      let orderAsc = true;

      const builder: any = {
        select: (_fields?: string) => builder,
        eq: (col: string, val: any) => {
          filters.push((item: any) => item[col] === val);
          return builder;
        },
        order: (col: string, options?: { ascending?: boolean }) => {
          orderByField = col;
          orderAsc = options?.ascending ?? true;
          return builder;
        },
        maybeSingle: async () => {
          const db = loadDB();
          if (tableName === 'app_settings') {
            const val = db.app_settings['exam_enabled'] ?? 'true';
            return { data: { key: 'exam_enabled', value: val }, error: null };
          }
          const list: any[] = (db as any)[tableName] || [];
          let filtered = list.filter((item) => filters.every((fn) => fn(item)));
          if (filtered.length === 0) return { data: null, error: null };
          const row = { ...filtered[0] };
          if (tableName === 'exam_sessions' && row.student_id) {
            const student = db.students.find((s) => s.id === row.student_id);
            if (student) {
              row.students = { full_name: student.full_name, roll_number: student.roll_number, department: student.department, email: student.email };
            }
          }
          return { data: row, error: null };
        },
        single: async () => {
          const res = await builder.maybeSingle();
          return res;
        },
        insert: (data: any) => {
          const insertPromise = (async () => {
            const db = loadDB();
            const list: any[] = (db as any)[tableName] || [];
            const rows = Array.isArray(data) ? data : [data];
            const inserted = rows.map((r) => {
              const item = {
                id: r.id || 'id_' + Math.random().toString(36).substring(2, 10),
                created_at: new Date().toISOString(),
                ...r,
              };
              list.push(item);
              return item;
            });
            (db as any)[tableName] = list;
            saveDB(db);
            return {
              data: Array.isArray(data) ? inserted : inserted[0],
              error: null,
            };
          })();

          return {
            select: (_fields?: string) => ({
              single: async () => insertPromise,
              maybeSingle: async () => insertPromise,
              then: (onfulfilled: any) => insertPromise.then(onfulfilled),
            }),
            then: (onfulfilled: any) => insertPromise.then(onfulfilled),
          };
        },
        update: (updates: any) => {
          const updatePromise = (async () => {
            const db = loadDB();
            const list: any[] = (db as any)[tableName] || [];
            for (let i = 0; i < list.length; i++) {
              if (filters.every((fn) => fn(list[i]))) {
                list[i] = { ...list[i], ...updates };
              }
            }
            (db as any)[tableName] = list;
            saveDB(db);
            return { data: null, error: null };
          })();

          return {
            eq: (col: string, val: any) => {
              filters.push((item: any) => item[col] === val);
              return {
                then: (onfulfilled: any) => updatePromise.then(onfulfilled),
              };
            },
            then: (onfulfilled: any) => updatePromise.then(onfulfilled),
          };
        },
        upsert: async (data: any) => {
          const db = loadDB();
          if (tableName === 'app_settings') {
            db.app_settings[data.key] = String(data.value);
            saveDB(db);
            return { data, error: null };
          }
          const list: any[] = (db as any)[tableName] || [];
          const idx = list.findIndex(
            (item) => item.session_id === data.session_id && item.question_index === data.question_index
          );
          if (idx >= 0) {
            list[idx] = { ...list[idx], ...data, answered_at: new Date().toISOString() };
          } else {
            list.push({ ...data, id: 'ans_' + Math.random().toString(36).substring(2, 9), answered_at: new Date().toISOString() });
          }
          (db as any)[tableName] = list;
          saveDB(db);
          return { data, error: null };
        },
        delete: () => ({
          eq: (col: string, val: any) => {
            const db = loadDB();
            const list: any[] = (db as any)[tableName] || [];
            (db as any)[tableName] = list.filter((item) => item[col] !== val);
            saveDB(db);
            return Promise.resolve({ data: null, error: null });
          },
        }),
        then: async (onfulfilled: any) => {
          const db = loadDB();
          const list: any[] = (db as any)[tableName] || [];
          let filtered = list.filter((item) => filters.every((fn) => fn(item)));
          if (tableName === 'exam_sessions') {
            filtered = filtered.map((row) => {
              const student = db.students.find((s) => s.id === row.student_id);
              return {
                ...row,
                students: student
                  ? { full_name: student.full_name, roll_number: student.roll_number, department: student.department, email: student.email }
                  : null,
              };
            });
          }
          return onfulfilled({ data: filtered, error: null });
        },
      };

      return builder;
    },
  };
}

export const supabaseAdmin = (isMock ? createMockClient() : realClient!) as any;
