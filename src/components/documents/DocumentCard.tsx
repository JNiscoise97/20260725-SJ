import { FileText, Image as ImageIcon, File as FileIcon } from "lucide-react"

import type { DocumentItem } from "@/types/domain"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif"]

export function DocumentCard({ document }: { document: DocumentItem }) {
  const extension = document.fileName.split(".").pop()?.toLowerCase()
  const isPdf = extension === "pdf"
  const isImage = !!extension && IMAGE_EXTENSIONS.includes(extension)

  return (
    <a href={document.filePath} target="_blank" rel="noreferrer" className="block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="space-y-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-foreground">
            {isPdf ? <FileText className="size-5" /> : isImage ? <ImageIcon className="size-5" /> : <FileIcon className="size-5" />}
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">{document.title}</p>
            <p className="text-xs text-muted-foreground">{document.fileName}</p>
          </div>
          {document.category ? <Badge className="bg-dore/20 text-brun">{document.category}</Badge> : null}
        </CardContent>
      </Card>
    </a>
  )
}
