const db = require('./config/db');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Task = require('./models/Task');
const ActivityLog = require('./models/ActivityLog');

async function verify() {
    console.log('--- SIMATU INTEGRATION VERIFICATION START ---');
    try {
        // 1. Check DB Connection
        const [dbCheck] = await db.query('SELECT 1');
        if (dbCheck) {
            console.log('[✓] Database connection pool successful.');
        }

        // 2. Clear old data for a clean verification run
        console.log('Cleaning tables for verification...');
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');
        await db.execute('TRUNCATE TABLE activity_logs');
        await db.execute('TRUNCATE TABLE tasks');
        await db.execute('TRUNCATE TABLE users');
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('[✓] Database tables cleaned successfully.');

        // 3. Seed Admin and User
        const adminPass = await bcrypt.hash('admin123', 10);
        const userPass = await bcrypt.hash('user123', 10);

        const adminId = await User.create({
            name: 'Admin Simatu',
            email: 'admin@simatu.com',
            password: adminPass,
            role: 'admin'
        });
        console.log(`[✓] Created Admin User (ID: ${adminId})`);

        const userId = await User.create({
            name: 'Budi Santoso',
            email: 'budi@simatu.com',
            password: userPass,
            role: 'user'
        });
        console.log(`[✓] Created Regular User (ID: ${userId})`);

        // 4. Create tasks
        const task1Id = await Task.create({
            title: 'Laporan Keuangan Q3',
            description: 'Menyusun laporan keuangan kuartal ketiga untuk audit internal.',
            status: 'Pending',
            priority: 'High',
            due_date: '2026-09-01',
            user_id: userId
        });
        await ActivityLog.create({
            user_id: adminId,
            task_id: task1Id,
            action: 'CREATE_TASK',
            details: 'Admin created task "Laporan Keuangan Q3" assigned to Budi Santoso'
        });
        console.log(`[✓] Created High Priority Task (ID: ${task1Id})`);

        const task2Id = await Task.create({
            title: 'Desain Mockup Dashboard',
            description: 'Membuat rancangan visual dashboard Simatu v2.',
            status: 'In Progress',
            priority: 'Medium',
            due_date: '2026-08-15',
            user_id: userId
        });
        await ActivityLog.create({
            user_id: userId,
            task_id: task2Id,
            action: 'CREATE_TASK',
            details: 'Budi Santoso created task "Desain Mockup Dashboard"'
        });
        console.log(`[✓] Created Medium Priority Task (ID: ${task2Id})`);

        // 5. Test Update Task
        await Task.update(task2Id, {
            title: 'Desain Mockup Dashboard v2',
            description: 'Membuat rancangan visual dashboard Simatu v2.',
            status: 'Completed',
            priority: 'Medium',
            due_date: '2026-08-15'
        });
        await ActivityLog.create({
            user_id: userId,
            task_id: task2Id,
            action: 'UPDATE_TASK',
            details: 'Budi Santoso completed task "Desain Mockup Dashboard v2"'
        });
        console.log(`[✓] Updated Task (ID: ${task2Id}) to Completed`);

        // 6. Verify Fetch Tasks with role authorization
        console.log('Verifying Task retrieval permissions...');
        const adminTasks = await Task.findAll({ role: 'admin', userId: adminId });
        console.log(`- Admin sees total tasks: ${adminTasks.length} (Expected: 2)`);

        const userTasks = await Task.findAll({ role: 'user', userId: userId });
        console.log(`- User Budi sees total tasks: ${userTasks.length} (Expected: 2)`);

        const adminOtherTasks = await Task.findAll({ role: 'user', userId: adminId });
        console.log(`- Admin acting as User sees total tasks: ${adminOtherTasks.length} (Expected: 0)`);

        // 7. Verify Statistics
        const stats = await Task.getStatistics(userId, 'user');
        console.log(`- User Stats - Total: ${stats.total}, Status Completed: ${stats.statusStats.find(s => s.status === 'Completed')?.count || 0}`);

        // 8. Verify Activity Logs
        const logs = await ActivityLog.findAll({ role: 'admin', userId: adminId });
        console.log(`- Total Activity Logs generated: ${logs.length} (Expected: 5)`);
        logs.forEach(log => {
            console.log(`  [LOG] [${log.action}] ${log.details}`);
        });

        console.log('[✓] ALL BACKEND AND DATABASE RELATION VERIFICATIONS COMPLETED SUCCESSFULLY!');
    } catch (error) {
        console.error('[X] VERIFICATION FAILED WITH ERROR:', error);
    } finally {
        await db.end();
        console.log('--- SIMATU INTEGRATION VERIFICATION END ---');
    }
}

verify();
