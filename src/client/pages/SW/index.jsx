import { html } from './article.md'

const Page = () => {
  return (
    <div className='md:max-w-xl m-auto container prose p-4'>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export default Page