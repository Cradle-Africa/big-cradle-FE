export interface TableData {
    id: string
    [key: string]: string | number | boolean | null | undefined
}

export interface TableField {
    key: string
    label: string
    className?: string
}

export interface TableComponentProps {
    title: string
    endpoint: string
    data?: TableData[]
    fields: TableField[]
    breadcrumbs: {
        parent: { path: string; label: string }
        current: string
    }
    actionConfig?: {
        suspend?: {
            endPoint: string
            method: string
            payload: Record<string, unknown>
        }
        delete?: {
            endPoint: string
            method: string
            payload: Record<string, unknown>
        }
        edit?: {
            endPoint: string
            method: string
            payload: Record<string, unknown>
        }
        view?: {
            endPoint: string
            method: string
            payload: Record<string, unknown>
        }
        review?: {
            endPoint: string
            method: string
            payload: Record<string, unknown>
        }
        
    }

    rightAction?: {
        add?: {
            label: string
            endpoint: string | undefined
            method: string
            icon?: string
            className?: string
            payload?: Record<string, unknown>
        }
    }
    onActionComplete?: (id: string) => void
}

export interface Department {
  id: string;
  departmentName: string;
  businessUserId: string;
}
