// lib/schema.ts

import { pgTable, text, timestamp, boolean, index, serial, primaryKey, unique,jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// 💡 Drizzle이 직접 SQL 함수를 사용하도록 설정
const genRandomUuid = sql`gen_random_uuid()::text`;

// 1. 사용자 테이블 (users)
export const users = pgTable('users', {
    id: text('id').primaryKey().default(genRandomUuid),
    email: text('email').unique().notNull(),
    raw_json: jsonb('raw_json'), 
    password: text('password').notNull(), 
    name: text('name').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    deleted_at: timestamp('deleted_at'), 
    
    updated_at: timestamp('updated_at').defaultNow(),
    
});

// 2. 프로젝트 테이블 (projects)
export const projects = pgTable('projects', {
    id: text('id').primaryKey().default(genRandomUuid),
    // users 테이블의 id를 참조하는 외래 키
    user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    image_url: text('image_url'),
    github_url: text('github_url'),
    demo_url: text('demo_url'), 
    live_url: text('live_url'),
    
    // 💡 SQL 스키마는 tags TEXT[] (PostgreSQL 배열)입니다. Drizzle에서는 'text("tags").array()'를 사용합니다.
    tags: text('tags').array().default([]).notNull(), 
    
    featured: boolean('featured').default(false),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
}, (table) => {
    return {
        // 인덱스 생성
        userIdIdx: index("idx_projects_user_id").on(table.user_id),
        featuredIdx: index("idx_projects_featured").on(table.featured),
    };
});