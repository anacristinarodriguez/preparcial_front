'use client';

import EditAuthorForm from '../../../components/EditAuthorForm';

export default function EditAuthorPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  return <EditAuthorForm id={id} />;
}
