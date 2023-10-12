import { Spin } from "antd"
import EditorArea from "src/components/Editor"

type DataTabProps = {
  markdownContent: string
  isLoading: boolean
  handleEditorChange: (newValue?: string | undefined) => void
}

const DocumentTab = ({
  markdownContent,
  isLoading,
  handleEditorChange,
}: DataTabProps) => {
  return (
    <div>
      {isLoading ? (
        <Spin style={{ position: "absolute", left: "50%", top: "50%" }}></Spin>
      ) : (
        <EditorArea
          markdownContent={markdownContent}
          handleEditorChange={handleEditorChange}
        />
      )}
    </div>
  )
}

export default DocumentTab
