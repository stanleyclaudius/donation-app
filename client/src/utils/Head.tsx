import { Helmet } from 'react-helmet'

interface IProps {
  title: string
}

const Head = ({ title }: IProps) => {
  return (
    <Helmet>
      <title>WeCare - {title}</title>
    </Helmet>
  )
}

export default Head