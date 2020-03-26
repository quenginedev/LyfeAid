import {app} from '@/main'
import pluralize from 'pluralize'
import tag from 'graphql-tag'


export default class Crud {

    constructor(name){
        this.name = name
        this.plural = pluralize(name)
        this.Name = name.charAt(0).toUpperCase() + name.slice(1)
        this.client = app.$apolloProvider.defaultClient
    }


    queries(queries, options = {} ){
        return this.client.query({
            query: tag`
                query(
                    $where: ${this.Name}WhereInput, 
                    $orderBy: ${this.Name}OrderByInput, 
                    $skip: Int,
                    $after: String,
                    $before: String,
                    $first: Int,
                    $last: Int
                    ){
                        ${queries}${node}
                    }
            `,
            variables: options,
        }).then(res=>{
            if(res.error)
                throw res.err
            else
                return {data: res.data}
        }).catch(err=>{
            throw err
        })
    }
    find(node, options = {}){
        return this.client.query({
            query: tag`
                query ${this.plural}(
                    $where: ${this.Name}WhereInput, 
                    $orderBy: ${this.Name}OrderByInput, 
                    $skip: Int,
                    $after: String,
                    $before: String,
                    $first: Int,
                    $last: Int
                    ){
                        ${this.plural}(
                            where: $where,
                            orderBy: $orderBy,
                            skip: $skip,
                            after: $after,
                            before: $before,
                            first: $first,
                            last: $last
                        )${node}

                        ${this.plural}Connection(
                            where: $where,
                            orderBy: $orderBy,
                            skip: $skip,
                            after: $after,
                            before: $before,
                            first: $first,
                            last: $last
                        ){
                            pageInfo{
                                hasNextPage
                            }
                        }
                    }
            `,
            variables: options,
        }).then(res=>{
            if(res.error)
                throw res.err
            else
                return {data: res.data[`${this.plural}`], hasNext:  res.data[`${this.plural}Connection`].pageInfo.hasNextPage}
        }).catch(err=>{
            throw err
        })
    }


    findOne(node, options){
        return this.client.query({
            query: tag`
                query ${this.name}($where: ${this.Name}WhereUniqueInput!){
                    ${this.name}(where: $where)${node}
                }
            `,
            variables: options
        }).then(res=> res.data[`${this.name}`])
            .catch(err=>{
                throw {class: 'crud', ...err}
            })
    }

    insert(node, options){
        return this.client.mutate({
            mutation: tag`
                mutation create${this.Name}($data: ${this.Name}CreateInput!){
                    create${this.Name}(data: $data)${node}
                }
            `,
            variables: options
        }).then(res=>res.data[`create${this.Name}`])
        .catch(err=>{
            throw err
        })
    }

    update(node, options){
        return this.client.mutate({
            mutation: tag`
                mutation update${this.Name}($where: ${this.Name}WhereUniqueInput!, $data: ${this.Name}UpdateInput!){
                    update${this.Name}(where: $where, data: $data)${node}
                }
            `,
            variables: options
        }).then(res=>res.data[`update${this.Name}`])
        .catch(err=>{
            throw err
        })
    }

    remove(node, options){
        return this.client.mutate({
            mutation: tag`
                mutation delete${this.Name}($where: ${this.Name}WhereUniqueInput!){
                    delete${this.Name}(where: $where)${node}
                }
            `,
            variables: options
        }).then(res=>res.data[`delete${this.Name}`])
            .catch(err=>{
                throw err
            })
    }

    subscribeToMore(node, options, callback = ()=>{}, error = ()=>{}){
        const subQuery = tag`subscription ${name}($where: ${this.Name}WhereInput) {
            ${this.name}(where: {
                node: $where
            }){
                mutation
                node${node}
            }
        }`;

        const observer = this.client.subscribe({
            query: subQuery,
            variables: options
        })

        observer.subscribe({
            next : (res)=>{
                callback(res.data[`${this.name}`])
            },
            error: error,
        })
    }
}