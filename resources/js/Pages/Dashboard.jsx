import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useCallback, useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';

export default function Dashboard({ auth, countUsers, countUnits, countRoles, countLogin, topUsers }) {
    useEffect(() => {
        // Inisialisasi DataTables setelah komponen dimuat
        $(document).ready(function() {
            $('#usersTable').DataTable({
                paging: false,
                searching: false,
            });
        });
    }, []);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-3 gap-4">
                    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 rounded">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Jumlah Karyawan</h3>
                        <span className="text-4xl">{countUsers}</span>
                    </div>

                    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 rounded">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Jumlah Unit</h3>
                        <span className="text-4xl">{countUnits}</span>
                    </div>

                    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 rounded">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Jumlah Jabatan</h3>
                        <span className="text-4xl">{countRoles}</span>
                    </div>

                    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 rounded">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Top 10 User Login</h3>

                        <table id="usersTable" className="display">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Total login</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topUsers.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.name}</td>
                                        <td>{user.total_logins}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
