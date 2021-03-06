module.exports = app => {
    const insert = (req, res) => {
        const student = { ...req.body }
        console.log({ ...student })

        app.db('student')
            .insert(student)
            .returning('id')
            .then(id => {
                res.json({ id: id[0] })
                console.log(id[0])
            })
            .catch(err => res.status(500).send(err))
    }

    const update = (req, res) => {
        const student = { ...req.body }
        console.log(student)

        app.db('student')
            .update(student)
            .where({ 
                id: req.params.id 
            })
            .then(_ => res.json({
                id: req.params.id
            }))
            .catch(err => res.status(500).send(err))
    }

    const remove = (req, res) => {
        app.db('student')
            .delete()
            .where({
                id: req.params.id
            })
            .then(_ => {
                res.json({ id: 0 })
            })
            .catch(err => res.status(500).send(err))
    }

    const signin = (req, res) => {
        app.db('student')
            .select('id')
            .where({ 
                email: req.header('email'),
                password: req.header('password') })
            .first()
            .then(student => res.json(student))
            .catch(err => res.status(500).send(err))    
    }

    const get = (_, res) => {
        app.db('student')
            .select()
            .then(students => res.json(students))
            .catch(err => res.status(500).send(err))  
    }

    const getById = (req, res) => {
        console.log(req.params.id)
        app.db('student')
            .select()
            .where({
                id: req.params.id
            })
            .first()
            .then(student => {
                delete student.id
                console.log(student)
                res.json(student)
            })
            .catch(err => res.status(500).send(err))
    }

    const getByCompany = (req, res) => {
        console.log(req.params.id)
        app.db('student')
            .select()
            .whereRaw(
                `id IN (
                    SELECT sv.student_id
                    FROM student_vacancy sv, vacancy v
                    WHERE sv.vacancy_id = v.id AND v.company_id = ${req.params.id});
                `)
            .then(students => {
                st = students.map(student => {
                    delete student.id
                    return student
                })
                console.log(st)
                res.json(st)
            })
            .catch(err => res.status(500).send(err))
    }

    const getByVacancy = (req, res) => {
        console.log(req.params.id)
        app.db('student')
            .select()
            .whereRaw(
                `id IN (
                    SELECT student_id
                    FROM student_vacancy
                    WHERE vacancy_id = ${req.params.id});
                `)
            .then(students => {
                st = students.map(student => {
                    delete student.id
                    return student
                })
                console.log(st)
                res.json(st)
            })
            .catch(err => res.status(500).send(err))
    }

    const insertPhone = (req, res) => {
        phone = { ...req.body }

        console.log({ ...phone })

        app.db('student_telephone')
            .insert(phone)
            .returning('id')
            .then(id => res.json({ id: id[0] }))
            .catch(err => res.status(500).send(err))
    }

    const getAllPhone = (req, res) => {
        /*app.db('student_telephone')
            .select()
            .where({ id: req.header['id'] })
            .then(phones => res.json(phones))
            .catch(err => res.status(500).send(err))*/
    }

    const insertCourse = (req, res) => {
        course = { ...req.body }

        console.log({ ...course })

        app.db('student_course')
            .insert(course)
            .returning('id')
            .then(id => res.json({ id: id[0] }))
            .catch(err => res.status(500).send(err))
    }

    return { 
        insert, 
        insertPhone, 
        insertCourse,
        get, 
        getById, 
        getByCompany,
        getByVacancy,
        getAllPhone,
        update, 
        remove, 
        signin
    }
}