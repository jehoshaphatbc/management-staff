import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useCallback, useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

import { toast } from 'react-toastify';

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

    // Open form modal
    const openFormModal = () => {
        setTypeForm('add');
        setShowLabel('Tambah Jabatan');
        setShowSubLabel('Tambah data jabatan sesuai dengan kebutuhan anda.');
        setShowFormModal(true);
    }

    // open edit form
    const editUser = (user) => {
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
                    toast.success('Berhasil menambahkan jabatan!');
                }
            });
        } else {
            // post(route('dashboard.users.update', data.id), {
            //     preserveScroll: true,
            //     onSuccess: () => {
            //         setShowFormModal(false);
            //         reset();
            //         toast.success('Succes update user!');
            //     }
            // });
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Jabatan</h2>}
        >
            <Head title="Jabatan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <PrimaryButton onClick={openFormModal}>Tambah Jabatan</PrimaryButton>
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

        </AuthenticatedLayout>
    );
}
