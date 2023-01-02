export type UpdateData<M extends { id: string }> = Omit<Partial<M> & Pick<M, 'id'>, 'createdAt'>

export type CreateData<M> = Omit<M, 'id' | 'createdAt'>
