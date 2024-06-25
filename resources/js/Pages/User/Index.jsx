import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useCallback, useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import ModalDialog from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Label from '@/Components/InputLabel';
import Input from '@/Components/TextInput';
import Error from '@/Components/InputError';
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';

export default function Index({ auth, users, units, roles }) {
    const [typeForm, setTypeForm] = useState('');
    const [showLabel, setShowLabel] = useState('');
    const [showSubLabel, setShowSubLabel] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);

    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [detail, setDetail] = useState(null);

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        id: '',
        name: '',
        unit: null,
        roles: [],
        getRoles: [],
        username: '',
        password: '',
    });

    useEffect(() => {
        // Inisialisasi DataTables setelah komponen dimuat
        $(document).ready(function() {
            $('#usersTable').DataTable();
        });
    }, []);

    // Open form modal
    const openFormModal = () => {
        setTypeForm('add');
        setShowLabel('Tambah Karyawan');
        setShowSubLabel('Tambah data karyawan sesuai kebutuhan anda.');
        setShowFormModal(true);
    }

    // open edit form
    const editUser = (user) => {
        setTypeForm('edit');
        user.password = '';
        setShowLabel('Ubah Karyawan');
        setShowSubLabel('Ubah data karyawan sesuai kebutuhan anda.');

        const formattedUser = {
            ...user,
            unit: units.find(unit => unit.value === user.unit_id) || null,
            roles: roles.map(userRole => {
                const role = user.getRoles.find(r => r.label === userRole.label);
                return role ? { value: role.value, label: role.label } : null;
            }).filter(role => role !== null)
        };

        setData(formattedUser);
        setShowFormModal(true);
    }

    // Close confirmation delete modal
    const closeFormModal = () => {
        setShowFormModal(false);
        reset();
    };

    // Handle form
    function handleChange(e) {
        setData(values => ({
            ...values,
            [e.target.id]: e.target.value,
        }))
    };

    // Handle select
    function handleChangeSelect(e) {
        setData(values => ({
            ...values,
            unit: e,
        }))
    };

    // Handle select multiple
    function handleChangeSelectMultiple(e) {
        setData(values => ({
            ...values,
            roles: e,
        }))
    };

    // Submit form
    const submitForm = (e) => {
        e.preventDefault();
        if(typeForm === 'add') {
            post(route('users.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setShowFormModal(false);
                    reset();
                    toast.success('Berhasil menambahkan data karyawan!');
                }
            });
        } else {
            post(route('users.update', data.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setShowFormModal(false);
                    reset();
                    toast.success('Berhasil mengubah data karyawan!');
                }
            });
        }
    }

    // open modal delete
    const deleteUser = (user) => {
        setDetail(user)
        setShowConfirmationDelete(true);
    }

    // Submit delete
    const submitDelete = (e) => {
        e.preventDefault();

        destroy(route('users.delete', detail.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Berhasil menghapus data karyawan!');
                closeConfirmationModal();
            }
        });
    }

    // Close confirmation delete modal
    const closeConfirmationModal = () => {
        setShowConfirmationDelete(false);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Karyawan</h2>}
        >
            <Head title="Karyawan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <PrimaryButton onClick={openFormModal}>Tambah Karyawan</PrimaryButton>

                    <div className="mt-10">
                        <table id="usersTable" className="display">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th className="w-44"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.name}</td>
                                        <td>{user.username}</td>
                                        <td className="flex justify-between">
                                            <PrimaryButton onClick={() => editUser(user)}>Edit</PrimaryButton>
                                            <SecondaryButton onClick={() => deleteUser(user)}>Delete</SecondaryButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Form Modal */}


            {/* Confirmation Delete */}
            <ModalDialog maxWidth="md" show={showConfirmationDelete} onClose={closeConfirmationModal}>
                <form onSubmit={submitDelete} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Apakah yakin untuk menghapus data karyawan ini?</h2>

                    <div className="mt-6 gap-4 flex justify-end">
                        <PrimaryButton type="submit" disabled={processing}>Delete!</PrimaryButton>
                        <SecondaryButton type="button" onClick={closeConfirmationModal}>Cancel</SecondaryButton>
                    </div>
                </form>
            </ModalDialog>

            <Dialog className="relative z-10" open={showFormModal} onClose={closeFormModal}>
                <div className="fixed inset-0" />

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                            <DialogPanel
                                transition
                                className="pointer-events-auto w-screen max-w-2xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                                >
                                <form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                    <div className="flex-1">
                                        {/* Header */}
                                        <div className="bg-gray-50 px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between space-x-3">
                                            <div className="space-y-1">
                                                <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                                                    {showLabel}
                                                </DialogTitle>
                                                <p className="text-sm text-gray-500">
                                                    {showSubLabel}
                                                </p>
                                            </div>
                                            <div className="flex h-7 items-center">
                                                <button
                                                type="button"
                                                className="relative text-gray-400 hover:text-gray-500"
                                                onClick={() => setOpen(false)}
                                                >
                                                <span className="absolute -inset-2.5" />
                                                <span className="sr-only">Close panel</span>
                                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                </button>
                                            </div>
                                            </div>
                                        </div>

                                        {/* Divider container */}
                                        <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                                            <div className="space-y-2 px-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                {/* Name */}
                                                <div>
                                                    <Label required htmlFor="name" value="Name" />

                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={data.name}
                                                        className="mt-1 block w-full"
                                                        autoComplete="name"
                                                        onChange={handleChange}
                                                    />
                                                    <Error message={errors.name} className="mt-2" />
                                                </div>

                                                <div>
                                                    <Label required htmlFor="username" value="Username" />

                                                    <Input
                                                        id="username"
                                                        name="username"
                                                        value={data.username}
                                                        className="mt-1 block w-full"
                                                        autoComplete="username"
                                                        onChange={handleChange}
                                                    />
                                                    <Error message={errors.username} className="mt-2" />
                                                </div>

                                                <div>
                                                    <Label required htmlFor="password" value="Password" />

                                                    <Input
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        value={data.password}
                                                        className="mt-1 block w-full"
                                                        autoComplete="password"
                                                        onChange={handleChange}
                                                    />
                                                    <Error message={errors.password} className="mt-2" />
                                                </div>

                                                <div>
                                                    <Label required htmlFor="unit" value="Unit" />

                                                    <CreatableSelect
                                                        classNames="z-50 overflow-visible"
                                                        onChange={handleChangeSelect}
                                                        value={data.unit}
                                                        options={units} />

                                                    <Error message={errors.unit} className="mt-2" />
                                                </div>

                                                <div>
                                                    <Label required htmlFor="roles" value="Jabatan" />

                                                    <CreatableSelect
                                                        onChange={handleChangeSelectMultiple}
                                                        options={roles}
                                                        value={data.roles}
                                                        isMulti/>

                                                    <Error message={errors.roles} className="mt-2" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                                        <div className="flex justify-end space-x-3">
                                            <PrimaryButton type="submit" disabled={processing}>Save</PrimaryButton>
                                            <SecondaryButton type="button" onClick={closeFormModal}>Close</SecondaryButton>
                                        </div>
                                    </div>
                                </form>
                            </DialogPanel>
                        </div>
                    </div>
                </div>
            </Dialog>

        </AuthenticatedLayout>
    );
}
