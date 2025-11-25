import { getProjects } from "@/lib/projects-db"
import { PortfolioContent } from "@/components/portfolio-content"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-db"

export default async function HomePage() {
    try {
        // 1. 로그인 상태 확인
        const user = await getCurrentUser()

        // 2. 로그인이 안 되어 있으면 로그인 페이지로 이동
        if (!user) {
            redirect('/login')
        }

        // 3. 로그인 된 경우 프로젝트 데이터 로드
        const projects = await getProjects()

        // 데이터 유효성 검사
        if (!Array.isArray(projects)) {
            console.error('Projects data is not an array:', projects)
            return <PortfolioContent projects={[]} />
        }

        return <PortfolioContent projects={projects} />
    } catch (error) {
        // redirect() 함수는 내부적으로 에러를 던지므로 다시 던져줘야 함
        if (error.message === 'NEXT_REDIRECT') {
            throw error
        }

        console.error('Error loading projects:', error)

        // 그 외 에러 발생 시에도 로그인 페이지로 리다이렉트 (안전장치)
        redirect('/login')
    }
}
