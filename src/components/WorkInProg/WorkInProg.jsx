import WorkProg from '../../assets/logos/workProg.svg'

const WorkInProg = () => {
  return (
    <div className='w-full h-[73vh] flex flex-col justify-center items-center' >
      <img src={WorkProg} width={90} alt="Work in Progress" />
      <p>Work in Progress..</p>
    </div>
  )
}

export default WorkInProg
