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
        resetPassword?: {
            endPoint: string
            method: string
            payload?: Record<string, unknown>
        },
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

export interface BreadsCrumpsProps {
    title: string
    openEmployee: boolean
    setOpenEmployee: React.Dispatch<React.SetStateAction<boolean>>
    openDepartment: boolean
    setOpenDepartment: React.Dispatch<React.SetStateAction<boolean>>
    openBusiness: boolean
    setOpenBusiness: React.Dispatch<React.SetStateAction<boolean>>
    breadcrumbs: {
        parent: { path: string; label: string }
        current: string
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
}