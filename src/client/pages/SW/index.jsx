import { html } from './article.md'

const Page = () => {
  return (
    <div className='prose'>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export default Page