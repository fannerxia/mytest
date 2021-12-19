import React, {useMemo} from 'react';
import {Card, Tree} from "antd";

function Complete({completeArr}) {
    // 控制子组件渲染
    const childrentree = useMemo(()=> {
        return completeArr
    },[completeArr])

    return (
        <>
            <Card style={{width: 500}} title="Completed">
                <Tree
                    checkable
                    disabled
                    treeData={childrentree}
                />
            </Card>
        </>
    );
}

export default Complete;