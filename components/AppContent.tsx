"use client"

import { useUserAuthContext } from "@/providers/userAuth"
import { AuthorizationProcess } from "./connect-actions/buttons/AuthorizationProcess"

export function AppContent({ children }: { children: React.ReactNode }) {
  const {
    getUser,
    displayAuthorizationProcess,
    setDisplayAuthorizationProcess,
  } = useUserAuthContext()

  return (
    <>
      <div className="flex-1">{children}</div>
      {displayAuthorizationProcess && (
        <AuthorizationProcess
          isOpen={displayAuthorizationProcess}
          onClose={() => setDisplayAuthorizationProcess(false)}
          user={getUser()}
        />
      )}
    </>
  )
}
