interface Props {
  children: React.ReactNode;
}

const Provider = ({ children }: Props) => {
  return <main className='flex flex-col items-center'>{children}</main>;
};

export default Provider;
