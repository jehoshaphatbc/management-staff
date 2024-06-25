import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useCallback, useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

import { toast } from 'react-toastify';

import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';

import ModalDialog from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Label from '@/Components/InputLabel';
import Input from '@/Components/TextInput';
import Error from '@/Components/InputError';

export default function Index({ auth, roles }) {
    const [typeForm, setTypeForm] = useState('');
    const [showLabel, setShowLabel] = useState('');
    const [showSubLabel, setShowSubLabel] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);

    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [detail, setDetail] = useState(null);

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        id: '',
        name: '',
    });

    useEffect(() => {
        // Inisialisasi DataTables setelah komponen dimuat
        $(document).ready(function() {
            $('#rolesTable').DataTable();
        });
    }, []);

    // Open form modal
    const openFormModal = () => {
        setTypeForm('add');
        setShowLabel('Tambah Jabatan');
        setShowSubLabel('Tambah data jabatan sesuai dengan kebutuhan anda.');
        setShowFormModal(true);
    }

    // open edit form
    const editRole = (user) => {
        setTypeForm('edit');
        user.password = '';
        setShowLabel('Ubah Jabatan');
        setShowSubLabel('Ubah data jabatan sesuai kebutuhan anda.');
        setData(user)
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

    // Submit form
    const submitForm = (e) => {
        e.preventDefault();
        if(typeForm === 'add') {
            post(route('roles.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setShowFormModal(false);
                    reset();
                    toast.success('Berhasil menambahkan data jabatan!');
                }
            });
        } else {
            post(route('roles.update', data.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setShowFormModal(false);
                    reset();
                    toast.success('Berhasil mengubah data jabatan!');
                }
            });
        }
    }

    // open modal delete
    const deleteRole = (user) => {
        setDetail(user)
        setShowConfirmationDelete(true);
    }

    // Submit delete
    const submitDelete = (e) => {
        e.preventDefault();

        destroy(route('roles.delete', detail.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Berhasil menghapus data role!');
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Jabatan</h2>}
        >
            <Head title="Jabatan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <PrimaryButton onClick={openFormModal}>Tambah Jabatan</PrimaryButton>

                    <div className="mt-10">
                        <table id="rolesTable" className="display">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th className="w-44"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.data.map((role, index) => (
                                    <tr key={index}>
                                        <td>{role.name}</td>
                                        <td className="flex justify-between">
                                            <PrimaryButton onClick={() => editRole(role)}>Edit</PrimaryButton>
                                            <SecondaryButton onClick={() => deleteRole(role)}>Delete</SecondaryButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            <ModalDialog maxWidth="2xl" show={showFormModal} onClose={closeFormModal}>
                <form onSubmit={submitForm}>

                    <div className='px-4 pt-8 sm:px-6 lg:px-16'>
                        <div className="mb-6">
                            <div className="text-center font-bold text-xl">{showLabel}</div>
                            <div className="text-center text-md font-medium text-gray-400">{showSubLabel}</div>
                        </div>
                        <div className="mt-6 space-y-4">
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
                        </div>
                        <div className="my-6 gap-4 flex justify-end">
                            <PrimaryButton type="submit" disabled={processing}>Save</PrimaryButton>
                            <SecondaryButton type="button" onClick={closeFormModal}>Close</SecondaryButton>
                        </div>
                    </div>
                </form>
            </ModalDialog>

            {/* Confirmation Delete */}
            <ModalDialog maxWidth="md" show={showConfirmationDelete} onClose={closeConfirmationModal}>
                <form onSubmit={submitDelete} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Apakah yakin untuk menghapus data jabatan ini?</h2>

                    <div className="mt-6 gap-4 flex justify-end">
                        <PrimaryButton type="submit" disabled={processing}>Delete!</PrimaryButton>
                        <SecondaryButton type="button" onClick={closeConfirmationModal}>Cancel</SecondaryButton>
                    </div>
                </form>
            </ModalDialog>

        </AuthenticatedLayout>
    );
}
